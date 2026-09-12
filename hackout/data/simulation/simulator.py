"""
Microgrid Crisis What-If Simulation Engine.
Implements run_scenario() with prioritized dispatch:
  Renewables (Solar+Wind) -> Battery Storage -> Diesel Genset -> Prioritized Load Shedding (P2 -> P1 -> P0).
"""

from typing import Dict, Any, Optional, List, Tuple
import copy
import numpy as np

from data.synthetic.village_load import generate_village_load
from data.synthetic.solar import generate_solar_profile
from data.synthetic.wind import generate_wind_profile
from data.synthetic.battery import BatteryStorage, BatteryConfig
from data.synthetic.fuel import (
    estimate_generator_fuel_burn,
    DEFAULT_DIESEL_CO2_KG_PER_LITER,
    DEFAULT_DIESEL_PRICE_PER_LITER,
)
from data.simulation.scenarios import apply_scenario
from data.simulation.metrics import compute_metrics, SimulationMetrics


def build_default_baseline_data(
    duration_hours: int = 24,
    seed: int = 42,
    location_name: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> Dict[str, Any]:
    """Generates standard baseline dataset for 24h or 48h simulation."""
    try:
        from backend.services.location_service import location_manager
        loc = location_manager.get_active_location()
        lat_val = latitude if latitude is not None else loc["latitude"]
        lon_val = longitude if longitude is not None else loc["longitude"]
        loc_str = location_name or loc["name"]
        comm_str = loc.get("community") or f"{loc.get('village', 'Rural')} Community Microgrid"
    except Exception:
        lat_val = latitude if latitude is not None else 23.84
        lon_val = longitude if longitude is not None else 69.76
        loc_str = location_name or "Dhordo, Kutch, Gujarat, India"
        comm_str = "Dhordo Community Microgrid"

    df_load = generate_village_load(duration_hours=duration_hours, seed=seed)
    df_solar = generate_solar_profile(duration_hours=duration_hours, pv_capacity_kw=60.0, seed=seed)
    df_wind = generate_wind_profile(duration_hours=duration_hours, rated_capacity_kw=30.0, seed=seed)

    return {
        "timestamps": df_load["timestamp"].tolist(),
        "time_strings": df_load["time_str"].tolist(),
        "demand_kw": df_load["demand_kw"].tolist(),
        "p0_kw": df_load["p0_kw"].tolist(),
        "p1_kw": df_load["p1_kw"].tolist(),
        "p2_kw": df_load["p2_kw"].tolist(),
        "solar_kw": df_solar["solar_available_kw"].tolist(),
        "wind_kw": df_wind["wind_available_kw"].tolist(),
        "battery_soc": 75.0,
        "battery_capacity_kwh": 120.0,
        "battery_min_soc": 20.0,
        "diesel_available": True,
        "diesel_capacity_kw": 60.0,
        "fuel_remaining_l": 450.0,
        "fuel_price_per_l": 1.45,
        "storm_mode": False,
        "location": loc_str,
        "community": comm_str,
        "latitude": lat_val,
        "longitude": lon_val,
    }


def simulate_microgrid_dispatch(
    data: Dict[str, Any],
    co2_kg_per_liter: float = DEFAULT_DIESEL_CO2_KG_PER_LITER,
    fuel_price_per_l: float = DEFAULT_DIESEL_PRICE_PER_LITER,
    dt_hours: float = 0.25,
) -> Tuple[Dict[str, Any], SimulationMetrics]:
    """
    Executes rule-based dispatch for microgrid simulation:
    1. Direct Renewable Use (Solar + Wind)
    2. Battery Dispatch (Charge surplus / Discharge deficit)
    3. Diesel Generator Dispatch (Fill remaining gap if available)
    4. Prioritized Load Shedding (P2 first, then P1, then P0)
    """
    demand_kw = list(data.get("demand_kw", []))
    n_intervals = len(demand_kw)
    
    solar_kw = list(data.get("solar_kw", [0.0] * n_intervals))
    wind_kw = list(data.get("wind_kw", [0.0] * n_intervals))
    
    # Priority demands
    p0_kw = list(data.get("p0_kw", [d * 0.28 for d in demand_kw]))
    p1_kw = list(data.get("p1_kw", [d * 0.44 for d in demand_kw]))
    p2_kw = list(data.get("p2_kw", [max(0.0, demand_kw[i] - p0_kw[i] - p1_kw[i]) for i in range(n_intervals)]))

    # Initialize battery
    initial_soc = float(data.get("battery_soc", 75.0))
    b_cap = float(data.get("battery_capacity_kwh", 120.0))
    min_soc = float(data.get("battery_min_soc", 20.0))
    storm_mode = bool(data.get("storm_mode", False))

    battery = BatteryStorage(
        BatteryConfig(
            capacity_kwh=b_cap,
            initial_soc_pct=initial_soc,
            min_soc_pct=min_soc,
            storm_min_soc_pct=40.0,
        )
    )
    battery.set_storm_mode(storm_mode)

    diesel_available = bool(data.get("diesel_available", True))
    diesel_capacity_kw = float(data.get("diesel_capacity_kw", 60.0))
    fuel_remaining = float(data.get("fuel_remaining_l", 450.0))

    # Dispatch trace arrays
    solar_served: List[float] = []
    wind_served: List[float] = []
    battery_power: List[float] = []  # + discharge, - charge
    battery_soc_trace: List[float] = []
    diesel_power: List[float] = []
    
    p0_served: List[float] = []
    p1_served: List[float] = []
    p2_served: List[float] = []
    unmet_power: List[float] = []

    cumulative_fuel_burned_l = 0.0

    for i in range(n_intervals):
        d_req = demand_kw[i]
        s_avail = solar_kw[i]
        w_avail = wind_kw[i]

        p0_req = p0_kw[i]
        p1_req = p1_kw[i]
        p2_req = p2_kw[i]

        renewables_avail = s_avail + w_avail
        
        # Step 1: Direct Renewable Consumption
        renew_consumed = min(d_req, renewables_avail)
        surplus_renewables = max(0.0, renewables_avail - d_req)
        deficit = max(0.0, d_req - renew_consumed)

        if renewables_avail > 0:
            s_frac = s_avail / renewables_avail
            w_frac = w_avail / renewables_avail
            s_used = renew_consumed * s_frac
            w_used = renew_consumed * w_frac
        else:
            s_used = 0.0
            w_used = 0.0

        solar_served.append(round(s_used, 2))
        wind_served.append(round(w_used, 2))

        # Step 2: Battery Storage
        if surplus_renewables > 0:
            # Attempt to charge battery with surplus
            b_act, new_soc = battery.step(-surplus_renewables, dt_hours=dt_hours)
        elif deficit > 0:
            # Attempt to discharge battery to cover deficit
            b_act, new_soc = battery.step(deficit, dt_hours=dt_hours)
            deficit = max(0.0, deficit - b_act)
        else:
            b_act, new_soc = battery.step(0.0, dt_hours=dt_hours)

        battery_power.append(round(b_act, 2))
        battery_soc_trace.append(round(new_soc, 2))

        # Step 3: Diesel Generator
        d_out = 0.0
        if deficit > 0 and diesel_available and fuel_remaining > 0:
            d_out = min(deficit, diesel_capacity_kw)
            step_fuel = estimate_generator_fuel_burn(d_out, duration_hours=dt_hours)
            if step_fuel <= fuel_remaining:
                fuel_remaining -= step_fuel
                cumulative_fuel_burned_l += step_fuel
                deficit = max(0.0, deficit - d_out)
            else:
                # Fuel depleted during step
                effective_kw = fuel_remaining / (0.28 * dt_hours)
                d_out = min(effective_kw, d_out)
                cumulative_fuel_burned_l += fuel_remaining
                fuel_remaining = 0.0
                deficit = max(0.0, deficit - d_out)

        diesel_power.append(round(d_out, 2))

        # Step 4: Prioritized Load Allocation
        total_supply = s_used + w_used + max(0.0, b_act) + d_out
        
        # P0 served first
        p0_s = min(p0_req, total_supply)
        rem = total_supply - p0_s

        # P1 served second
        p1_s = min(p1_req, rem)
        rem -= p1_s

        # P2 served third
        p2_s = min(p2_req, rem)

        p0_served.append(round(p0_s, 2))
        p1_served.append(round(p1_s, 2))
        p2_served.append(round(p2_s, 2))
        unmet_power.append(round(deficit, 2))

    # Compile result dispatch dict
    dispatch_results = {
        "demand_kw": demand_kw,
        "solar_kw": solar_served,
        "wind_kw": wind_served,
        "battery_kw": battery_power,
        "battery_soc": battery_soc_trace,
        "diesel_kw": diesel_power,
        "p0_served_kw": p0_served,
        "p1_served_kw": p1_served,
        "p2_served_kw": p2_served,
        "unmet_demand_kw": unmet_power,
        "final_fuel_remaining_l": round(fuel_remaining, 1),
    }

    metrics = compute_metrics(
        demand_kw=demand_kw,
        solar_served_kw=solar_served,
        wind_served_kw=wind_served,
        battery_discharged_kw=[max(0.0, b) for b in battery_power],
        diesel_kw=diesel_power,
        p0_demand_kw=p0_kw,
        p1_demand_kw=p1_kw,
        p2_demand_kw=p2_kw,
        p0_served_kw=p0_served,
        p1_served_kw=p1_served,
        p2_served_kw=p2_served,
        diesel_liters_total=cumulative_fuel_burned_l,
        battery_throughput_kwh=battery.cumulative_charge_kwh + battery.cumulative_discharge_kwh,
        co2_kg_per_liter=co2_kg_per_liter,
        fuel_price_per_l=fuel_price_per_l,
        dt_hours=dt_hours,
    )

    return dispatch_results, metrics


def run_scenario(
    baseline_data: Optional[Dict[str, Any]] = None,
    scenario: str = "SOLAR_FAILURE",
    severity: float = 50.0,
    duration_hours: float = 24.0,
    co2_kg_per_liter: float = DEFAULT_DIESEL_CO2_KG_PER_LITER,
    fuel_price_per_l: float = DEFAULT_DIESEL_PRICE_PER_LITER,
) -> Dict[str, Any]:
    """
    Primary API method for What-If Microgrid Crisis Simulation.
    
    Inputs:
        baseline_data: Baseline microgrid data dictionary (if None, builds default 24h baseline).
        scenario: Scenario name (e.g. 'SOLAR_FAILURE', 'WIND_FAILURE', 'BATTERY_LOW',
                  'DIESEL_UNAVAILABLE', 'DEMAND_SPIKE', 'STORM_48H', 'FUEL_PRICE_INCREASE').
        severity: Severity percentage 0 - 100%.
        duration_hours: Duration of scenario in hours.
        co2_kg_per_liter: Configurable emission factor.
        fuel_price_per_l: Fuel cost per liter.

    Outputs:
        before: Baseline summary snapshot and time-series averages.
        after: Crisis modified scenario summary and time-series averages.
        metrics: Granular energy, fuel, reliability, and emissions impact metrics.
    """
    if baseline_data is None:
        baseline_data = build_default_baseline_data(duration_hours=int(duration_hours))

    # 1. Run baseline dispatch ("Before")
    before_dispatch, before_metrics = simulate_microgrid_dispatch(
        baseline_data,
        co2_kg_per_liter=co2_kg_per_liter,
        fuel_price_per_l=fuel_price_per_l,
    )

    # 2. Apply scenario transformations
    modified_data, scenario_def = apply_scenario(
        baseline_data=baseline_data,
        scenario_name=scenario,
        severity=severity,
        duration_hours=duration_hours,
    )

    # 3. Run scenario dispatch ("After")
    after_dispatch, after_metrics = simulate_microgrid_dispatch(
        modified_data,
        co2_kg_per_liter=co2_kg_per_liter,
        fuel_price_per_l=modified_data.get("fuel_price_per_l", fuel_price_per_l),
    )

    # Compile concise summary snapshots for UI / Member 2 consumption
    before_summary = {
        "solar_avg_kw": round(float(np.mean(before_dispatch["solar_kw"])), 1),
        "wind_avg_kw": round(float(np.mean(before_dispatch["wind_kw"])), 1),
        "battery_soc_end": round(float(before_dispatch["battery_soc"][-1]), 1),
        "diesel_avg_kw": round(float(np.mean(before_dispatch["diesel_kw"])), 1),
        "demand_avg_kw": round(float(np.mean(before_dispatch["demand_kw"])), 1),
    }

    after_summary = {
        "solar_avg_kw": round(float(np.mean(after_dispatch["solar_kw"])), 1),
        "wind_avg_kw": round(float(np.mean(after_dispatch["wind_kw"])), 1),
        "battery_soc_end": round(float(after_dispatch["battery_soc"][-1]), 1),
        "diesel_avg_kw": round(float(np.mean(after_dispatch["diesel_kw"])), 1),
        "demand_avg_kw": round(float(np.mean(after_dispatch["demand_kw"])), 1),
    }

    cost_delta = round(after_metrics.fuel_cost_dollars - before_metrics.fuel_cost_dollars, 2)
    diesel_delta = round(after_metrics.diesel_fuel_liters - before_metrics.diesel_fuel_liters, 2)
    co2_delta = round(after_metrics.co2_emissions_kg - before_metrics.co2_emissions_kg, 2)

    return {
        "location": baseline_data.get("location", "Rural Microgrid, India"),
        "community": baseline_data.get("community", "Rural Community Microgrid"),
        "latitude": baseline_data.get("latitude", 23.84),
        "longitude": baseline_data.get("longitude", 69.76),
        "scenario": scenario_def.name,
        "scenario_type": scenario_def.scenario_type.value,
        "severity": severity,
        "duration_hours": duration_hours,
        "before": before_summary,
        "after": after_summary,
        "before_detailed": before_dispatch,
        "after_detailed": after_dispatch,
        "metrics": after_metrics.to_dict(),
        "baseline_metrics": before_metrics.to_dict(),
        "deltas": {
            "additional_diesel_liters": diesel_delta,
            "additional_co2_kg": co2_delta,
            "cost_difference_dollars": cost_delta,
        },
    }
