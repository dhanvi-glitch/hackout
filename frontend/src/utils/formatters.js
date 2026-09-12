export const formatPower = (valInKw) => {
  if (valInKw === undefined || valInKw === null) return '0.0 kW';
  return `${Number(valInKw).toFixed(1)} kW`;
};

export const formatEnergy = (valInKwh) => {
  if (valInKwh === undefined || valInKwh === null) return '0 kWh';
  return `${Number(valInKwh).toFixed(0)} kWh`;
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${Math.round(val)}%`;
};

export const formatCurrency = (val) => {
  if (val === undefined || val === null) return '$0.00';
  return `$${Number(val).toFixed(2)}`;
};

export const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0';
  return `₹${Math.round(Number(val)).toLocaleString('en-IN')}`;
};

export const formatFuel = (liters) => {
  if (liters === undefined || liters === null) return '0 L';
  return `${Math.round(liters)} L`;
};

export const formatCO2 = (kg) => {
  if (kg === undefined || kg === null) return '0.0 kg';
  return `${Number(kg).toFixed(1)} kg`;
};

export const formatTime = (dateObj = new Date()) => {
  return new Date(dateObj).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const formatCountdown = (secondsRemaining) => {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'OPTIMAL':
    case 'ONLINE':
    case 'HEALTHY':
    case 'PROTECTED':
    case 'NORMAL':
    case 'SUCCESS':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'WARNING':
    case 'SHIFTABLE':
    case 'STORM_MODE':
    case 'CHARGING':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'OFFLINE':
    case 'CRITICAL':
    case 'CURTAILABLE':
    case 'CURTAILED':
    case 'FAILURE':
    case 'DISCHARGING':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'OFF':
    case 'STANDBY':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
