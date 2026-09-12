# OptiGrid-AI API Contract

This document defines the interface contracts between Frontend, Backend, Optimization, and Data layers.

---

## 1. REST Endpoints (`/api`)

### System & Health
- `GET /api/system/status`: Microgrid live state, generation mix, renewable penetration %, battery SOC %, fuel level, health status.
- `GET /api/health`: Health status of FastAPI server and SQLite database connection.
- `POST /api/weather/refresh`: Forces live meteorological telemetry fetch via Open-Meteo with fallback.

### Storage & Logistics
- `GET /api/battery`: 100 kWh BESS operational state, 24-hour SOC curve, and storm reserve mode.
- `POST /api/battery/storm-mode`: Toggles 50% SOC minimum storm reserve threshold.
- `GET /api/fuel`: Diesel generator telemetry, tank level, burn rate, autonomy days remaining.
- `GET /api/loads`: P0 (Critical), P1 (Shiftable), P2 (Curtailable) demand distribution and status.

### Forecasting & Optimization
- `GET /api/forecast`: 24-hour predictive forecast across 96 fifteen-minute intervals (demand, solar, wind, battery SOC, diesel).
- `POST /api/optimize`: Solves optimal microgrid energy dispatch using Member 3's MILP/MPC engine.
- `GET /api/dispatch/latest`: Returns most recent dispatch solution and environmental KPIs.
- `GET /api/dispatch/history`: Returns historical dispatch records for analytical charts.

### Crisis Simulator & Notifications
- `POST /api/simulation/run`: Simulates stress scenarios (`SOLAR_FAILURE`, `WIND_FAILURE`, `BATTERY_LOW`, `DIESEL_UNAVAILABLE`, `DEMAND_SPIKE`, `STORM_48H`, `FUEL_PRICE_INCREASE`).
- `GET /api/alerts`: Returns active grid alarms, warnings, and priority advisories.

---

## 2. Real-Time WebSocket API (`/ws`)

Broadcasts microgrid events:
- `SYSTEM_STATUS_UPDATED`: Periodic telemetry updates every 5 seconds.
- `SOLAR_CHANGED`: Dynamic solar irradiance / PV generation change.
- `WIND_CHANGED`: Dynamic wind speed / turbine generation change.
- `BATTERY_CHANGED`: Battery SOC % and charge/discharge power change.
- `DIESEL_STARTED`: Generator ignition notification.
- `DIESEL_STOPPED`: Generator shutoff notification.
- `NEW_OPTIMIZATION`: Broadcast of latest MILP/MPC dispatch results.
- `LOAD_SHED`: Priority load curtailment event.
- `STORM_MODE`: Emergency battery reserve status change.
- `FUEL_WARNING`: Low fuel autonomy threshold advisory.
- `ALERT_CREATED`: New critical alert triggered.

---

## 3. Internal Python Service Contracts

- **`data.get_mpc_inputs(...)`**: Generates 96-timestep synchronized arrays (`demand_forecast`, `solar_forecast`, `wind_forecast`, `p0_forecast`, `p1_forecast`, `p2_forecast`, battery specs, diesel specs, storm flag) formatted directly for `optimization.optimize_dispatch()`.
- **`optimization.optimize_dispatch(input_data)`**: Solves the 96-timestep PuLP MILP formulation and returns an `OptimizationResult`.
- **`optimization.run_mpc(input_data)`**: Solves rolling-horizon lookahead and returns current timestep control action plus full trajectory.
