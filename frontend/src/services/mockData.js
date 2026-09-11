// Comprehensive mock data service for OptiGrid-AI standalone execution & fallback

export const initialSystemStatus = {
  isOnline: true,
  lastOptimizationTime: "10:45:00",
  nextOptimizationInSeconds: 485, // ~8 mins countdown
  weather: {
    condition: "Partly Cloudy",
    temperatureC: 28.5,
    solarIrradianceWm2: 820,
    windSpeedMs: 7.2,
    forecastWarning: null,
  },
  metrics: {
    currentDemandKw: 48.2,
    renewableGenKw: 41.7,
    solarGenKw: 26.4,
    windGenKw: 15.3,
    batteryPowerKw: 6.5, // positive = discharging to load, negative = charging
    batterySocPercent: 68,
    batteryHealthPercent: 91,
    dieselStatus: "OFF",
    dieselPowerKw: 0.0,
    renewablePercent: 86.5,
    co2AvoidedKgDay: 142.8,
    fuelRemainingLiters: 360,
    fuelDaysRemaining: 20,
    criticalLoadReliabilityPercent: 100.0,
    dispatchStatus: "OPTIMAL",
  },
  liveDispatch: {
    solarKw: 26.4,
    windKw: 15.3,
    batteryKw: 6.5,
    dieselKw: 0.0,
    totalSupplyKw: 48.2,
    demandKw: 48.2,
    status: "OPTIMAL",
    costPerHour: 4.25,
    dieselSavedLitersDay: 85,
    co2AvoidedKgDay: 142.8,
    batteryImpact: "Normal Discharge (-6.5 kW)",
    reliability: "100% P0 Protected",
  }
};

export const generate24HourForecast = () => {
  const intervals = [];
  const startHour = 0;
  
  for (let i = 0; i < 96; i++) {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    // Demand profile: low at night (20-30kW), morning peak (45kW), afternoon steady (35-40kW), evening peak (60-70kW)
    let demand = 25 + Math.sin((hour - 4) * Math.PI / 12) * 15 + Math.exp(-Math.pow(hour - 20, 2) / 8) * 30;
    demand = Math.max(18, Math.min(75, demand + (Math.random() * 2 - 1)));

    // Solar profile: 0 at night, bell curve from 06:00 to 18:00 peaking around 13:00 at ~45kW
    let solar = 0;
    if (hour >= 6 && hour <= 18) {
      solar = 45 * Math.sin((hour - 6) * Math.PI / 12);
      solar = Math.max(0, solar + (Math.random() * 3 - 1.5));
    }

    // Wind profile: fluctuating between 8kW and 22kW, higher at night
    let wind = 14 + Math.cos((hour + 2) * Math.PI / 8) * 6 + (Math.random() * 3 - 1.5);
    wind = Math.max(5, Math.min(25, wind));

    // Net generation before battery
    const netRenewable = solar + wind;
    
    // Battery SOC simulation: charges during peak solar (midday), discharges during evening peak
    let soc = 68;
    if (hour >= 10 && hour <= 16) {
      soc = 60 + ((hour - 10) * 5); // charging up to ~90%
    } else if (hour >= 17 && hour <= 23) {
      soc = 90 - ((hour - 17) * 4.5); // discharging down to ~60%
    } else {
      soc = 60 - (hour * 0.5);
    }
    soc = Math.max(20, Math.min(95, Math.round(soc)));

    // Diesel generation required if renewable + battery discharging falls short of demand
    let diesel = 0;
    if (netRenewable + 15 < demand && soc <= 25) {
      diesel = demand - netRenewable - 5;
    }
    diesel = Math.max(0, Math.round(diesel * 10) / 10);

    intervals.push({
      interval: i + 1,
      time: timeStr,
      demand: Math.round(demand * 10) / 10,
      solar: Math.round(solar * 10) / 10,
      wind: Math.round(wind * 10) / 10,
      batterySoc: soc,
      diesel: diesel,
    });
  }
  return intervals;
};

export const batteryDetailsMock = {
  capacityKwh: 100,
  currentSocPercent: 68,
  minSocPercent: 20,
  maxSocPercent: 95,
  stormReservePercent: 50,
  isStormModeActive: false,
  healthPercent: 91,
  cycleCount: 1247,
  todayThroughputKwh: 82.4,
  deepDischargeEvents: 0,
  socHistory: Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    soc: Math.round(65 + Math.sin(i / 3) * 20),
    minLimit: 20,
    stormLimit: 50,
  }))
};

export const loadManagementMock = {
  totalDemandKw: 48.2,
  summary: {
    p0ServedPercent: 100,
    p1ServedPercent: 92,
    p2ServedPercent: 61,
  },
  priorities: [
    {
      id: "p0",
      tier: "P0 — CRITICAL",
      type: "PROTECTED",
      color: "#EF4444",
      servedPercent: 100,
      currentKw: 15.0,
      maxKw: 15.0,
      items: [
        { name: "Off-Grid Community Hospital", kw: 8.5, status: "PROTECTED" },
        { name: "Vaccine Storage Refrigerators", kw: 3.2, status: "PROTECTED" },
        { name: "Emergency Communications Tower", kw: 2.1, status: "PROTECTED" },
        { name: "Central Security & Street Lighting", kw: 1.2, status: "PROTECTED" },
      ]
    },
    {
      id: "p1",
      tier: "P1 — SHIFTABLE",
      type: "SHIFTABLE",
      color: "#F59E0B",
      servedPercent: 92,
      currentKw: 18.4,
      maxKw: 20.0,
      items: [
        { name: "Community Water Well Pumps", kw: 9.0, status: "ACTIVE" },
        { name: "Agricultural Irrigation Pumps", kw: 6.4, status: "ACTIVE" },
        { name: "Grain Processing Workshop", kw: 3.0, status: "SHIFTED_PARTIAL" },
      ]
    },
    {
      id: "p2",
      tier: "P2 — DEFERRABLE",
      type: "CURTAILABLE",
      color: "#3B82F6",
      servedPercent: 61,
      currentKw: 14.8,
      maxKw: 24.2,
      items: [
        { name: "Residential AC & High Power Units", kw: 8.2, status: "CURTAILED_30%" },
        { name: "Community Center Secondary Lighting", kw: 4.1, status: "ACTIVE" },
        { name: "EV / E-Motorcycle Charging Station", kw: 2.5, status: "CURTAILED_50%" },
      ]
    }
  ]
};

export const fuelIntelligenceMock = {
  tankCapacityLiters: 500,
  fuelRemainingLiters: 360,
  tankLevelPercent: 72,
  currentBurnRateLitersPerDay: 18,
  daysRemaining: 20,
  estimatedDepletionDate: "2026-10-02",
  status: "NORMAL", // NORMAL, WARNING, CRITICAL
  generator: {
    status: "STANDBY", // STANDBY, RUNNING, OFFLINE
    name: "Caterpillar DE50 50kVA Generator",
    currentOutputKw: 0.0,
    maxCapacityKw: 45.0,
    runtimeTodayHours: 1.5,
    fuelConsumedTodayLiters: 12.4,
    lastMaintenanceDate: "2026-08-15",
  },
  consumptionHistory: [
    { day: "Mon", liters: 14 },
    { day: "Tue", liters: 22 },
    { day: "Wed", liters: 18 },
    { day: "Thu", liters: 12 },
    { day: "Fri", liters: 16 },
    { day: "Sat", liters: 20 },
    { day: "Sun", liters: 18 },
  ]
};

export const initialAlerts = [
  {
    id: 1,
    type: "SUCCESS",
    title: "Optimization Run Complete",
    message: "System operating normally with 86.5% renewable penetration.",
    timestamp: "10:45 AM",
    read: false,
  },
  {
    id: 2,
    type: "INFO",
    title: "Solar Peak Window",
    message: "Solar irradiance peak reaching 820 W/m². Battery charging active.",
    timestamp: "10:30 AM",
    read: false,
  },
  {
    id: 3,
    type: "WARNING",
    title: "Storm Advisory",
    message: "High wind and storm predicted in 18 hours. Consider Storm Reserve mode.",
    timestamp: "09:15 AM",
    read: false,
  },
];

export const runMockOptimization = (params) => {
  const demand = parseFloat(params.currentDemand) || 48.2;
  const solarAvail = parseFloat(params.solarAvailable) || 26.4;
  const windAvail = parseFloat(params.windAvailable) || 15.3;
  const batterySoc = parseFloat(params.batterySoc) || 68;
  const minSoc = parseFloat(params.minSoc) || 20;

  // Decide optimal dispatch
  let solarDisp = Math.min(solarAvail, demand);
  let remDemand = demand - solarDisp;

  let windDisp = Math.min(windAvail, remDemand);
  remDemand -= windDisp;

  let batteryDisp = 0;
  if (remDemand > 0 && batterySoc > minSoc) {
    batteryDisp = Math.min(remDemand, 15); // Max 15kW battery discharge
    remDemand -= batteryDisp;
  }

  let dieselDisp = 0;
  if (remDemand > 0) {
    dieselDisp = remDemand;
    remDemand = 0;
  }

  const totalGen = solarDisp + windDisp + batteryDisp + dieselDisp;
  const renewablePct = ((solarDisp + windDisp) / totalGen) * 100;
  const dieselBurn = (dieselDisp * 0.28).toFixed(1); // 0.28 L per kWh
  const estCost = (dieselDisp * 1.45 + batteryDisp * 0.05).toFixed(2);
  const co2 = (dieselDisp * 0.72).toFixed(1);

  return {
    dispatch: {
      solarKw: Math.round(solarDisp * 10) / 10,
      windKw: Math.round(windDisp * 10) / 10,
      batteryKw: Math.round(batteryDisp * 10) / 10,
      dieselKw: Math.round(dieselDisp * 10) / 10,
    },
    metrics: {
      totalGenerationKw: Math.round(totalGen * 10) / 10,
      unmetDemandKw: Math.round(remDemand * 10) / 10,
      renewablePercent: Math.round(renewablePct * 10) / 10,
      estimatedCostPerHour: estCost,
      fuelConsumptionLitersHour: dieselBurn,
      co2EmissionsKgHour: co2,
      reliabilityPercent: remDemand > 0 ? 94.5 : 100.0,
    }
  };
};

export const runMockSimulation = ({ scenario, severity, durationHours }) => {
  const sevMultiplier = (severity || 50) / 100;
  
  let before = { solar: 30.0, wind: 15.0, battery: 5.0, diesel: 0.0, demand: 50.0 };
  let after = { ...before };

  let p0 = 100;
  let p1 = 92;
  let p2 = 61;
  let addDiesel = 0;
  let addCo2 = 0;
  let costDiff = 0;

  switch (scenario) {
    case 'SOLAR_FAILURE':
      after.solar = Math.round(before.solar * (1 - sevMultiplier));
      after.diesel = Math.round((before.solar - after.solar) * 0.8);
      after.battery = Math.round(before.battery + (before.solar - after.solar) * 0.2);
      p2 = Math.max(0, 61 - Math.round(sevMultiplier * 50));
      p1 = Math.max(40, 92 - Math.round(sevMultiplier * 20));
      addDiesel = (after.diesel * (durationHours || 12) * 0.28).toFixed(1);
      addCo2 = (addDiesel * 2.68).toFixed(1);
      costDiff = (addDiesel * 1.50).toFixed(2);
      break;

    case 'WIND_FAILURE':
      after.wind = Math.round(before.wind * (1 - sevMultiplier));
      after.diesel = Math.round((before.wind - after.wind) * 0.7);
      p2 = Math.max(20, 61 - Math.round(sevMultiplier * 30));
      addDiesel = (after.diesel * (durationHours || 12) * 0.28).toFixed(1);
      addCo2 = (addDiesel * 2.68).toFixed(1);
      costDiff = (addDiesel * 1.50).toFixed(2);
      break;

    case 'BATTERY_LOW':
      after.battery = 0;
      after.diesel = Math.round(before.battery);
      p2 = 45;
      addDiesel = (after.diesel * (durationHours || 12) * 0.28).toFixed(1);
      addCo2 = (addDiesel * 2.68).toFixed(1);
      costDiff = (addDiesel * 1.50).toFixed(2);
      break;

    case 'DIESEL_UNAVAILABLE':
      after.diesel = 0;
      p2 = 0; // Total curtailment of deferrable loads
      p1 = Math.max(10, 92 - Math.round(sevMultiplier * 60));
      p0 = sevMultiplier > 0.8 ? 95 : 100;
      addDiesel = 0;
      addCo2 = 0;
      costDiff = "-45.00";
      break;

    case 'DEMAND_SPIKE':
      after.demand = Math.round(before.demand * (1 + sevMultiplier * 0.5));
      after.diesel = Math.round((after.demand - before.demand) * 0.9);
      p2 = 30;
      addDiesel = (after.diesel * (durationHours || 12) * 0.28).toFixed(1);
      addCo2 = (addDiesel * 2.68).toFixed(1);
      costDiff = (addDiesel * 1.50).toFixed(2);
      break;

    case 'STORM_48H':
      after.solar = 2.0;
      after.wind = 22.0;
      after.diesel = 18.0;
      after.battery = 8.0;
      p2 = 15;
      p1 = 70;
      addDiesel = (18.0 * (durationHours || 48) * 0.28).toFixed(1);
      addCo2 = (addDiesel * 2.68).toFixed(1);
      costDiff = (addDiesel * 1.50).toFixed(2);
      break;

    case 'FUEL_PRICE_INCREASE':
      costDiff = (45.0 * sevMultiplier * (durationHours || 24)).toFixed(2);
      break;

    default:
      break;
  }

  return {
    scenario,
    severity,
    durationHours,
    before,
    after,
    impact: {
      p0ReliabilityPercent: p0,
      p1ServedPercent: p1,
      p2ServedPercent: p2,
      additionalDieselLiters: addDiesel,
      additionalCo2Kg: addCo2,
      costDifferenceDollars: costDiff,
    }
  };
};
