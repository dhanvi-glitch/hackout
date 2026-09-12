import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';
import { wsClient } from '../services/websocket';

export const SystemStatusContext = createContext(null);

const DEFAULT_LOCATION = {
  id: 'baramati',
  name: 'Baramati Rural',
  district: 'Pune District',
  state: 'Maharashtra',
  country: 'India',
  latitude: 18.15,
  longitude: 74.58,
  climate: 'Semi-Arid Agro Basin',
  community: 'Farming & Agro-Processing Microgrid',
};

const DEFAULT_PRESETS = [
  DEFAULT_LOCATION,
  {
    id: 'dhordo',
    name: 'Dhordo, Kutch',
    district: 'Kutch District',
    state: 'Gujarat',
    country: 'India',
    latitude: 23.83,
    longitude: 69.57,
    climate: 'Arid Salt Marsh & High Solar Desert',
    community: 'Remote Border Crafts & Tourism Microgrid',
  },
  {
    id: 'rameshwaram',
    name: 'Rameshwaram Coastal',
    district: 'Ramanathapuram District',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 9.28,
    longitude: 79.31,
    climate: 'Tropical Maritime & High Wind Corridor',
    community: 'Coastal Fishing & Desalination Microgrid',
  },
  {
    id: 'hampi',
    name: 'Hampi Rural',
    district: 'Vijayanagara District',
    state: 'Karnataka',
    country: 'India',
    latitude: 15.33,
    longitude: 76.46,
    climate: 'Hot Semi-Arid Plateau',
    community: 'Heritage Tourism & Agrarian Cluster',
  },
  {
    id: 'pokhran',
    name: 'Pokhran Thar Microgrid',
    district: 'Jaisalmer District',
    state: 'Rajasthan',
    country: 'India',
    latitude: 26.92,
    longitude: 71.91,
    climate: 'Extreme Arid Thar Desert',
    community: 'Off-Grid Pastoral Desert Settlement',
  },
];

export const SystemStatusProvider = ({ children }) => {
  const [status, setStatus] = useState(null);
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATION);
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [weatherSource, setWeatherSource] = useState('LIVE');
  const [forecast, setForecast] = useState([]);
  const [optimizationMode, setOptimizationMode] = useState('balanced'); // 'cost_saver' | 'balanced' | 'green'
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Request ID to drop stale responses during rapid location changes
  const requestIdRef = useRef(0);

  // Fetch full system state & forecast
  const fetchStatusAndForecast = useCallback(async (coords = null) => {
    try {
      setLoading(true);
      const [statusData, locData] = await Promise.all([
        apiService.getSystemStatus(),
        apiService.getLocation(),
      ]);

      if (locData?.activeLocation) {
        setActiveLocation(locData.activeLocation);
      }
      if (locData?.presets?.length) {
        setPresets(locData.presets);
      }

      setStatus(statusData);
      setWeatherSource(statusData?.weatherSource || statusData?.weather?.source || 'LIVE');

      const targetLat = coords?.latitude ?? locData?.activeLocation?.latitude ?? DEFAULT_LOCATION.latitude;
      const targetLon = coords?.longitude ?? locData?.activeLocation?.longitude ?? DEFAULT_LOCATION.longitude;

      const forecastData = await apiService.getForecast({ latitude: targetLat, longitude: targetLon });
      setForecast(forecastData || []);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize OptiGrid system status:', err);
      setError(err.message || 'Failed to connect to microgrid backend');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update Location with sequential stages & race condition prevention
  const updateLocation = async (newLocation) => {
    requestIdRef.current += 1;
    const currentReqId = requestIdRef.current;

    try {
      setLoading(true);

      // Stage 1: Updating location
      setLoadingStage('📍 Updating location...');
      await new Promise((r) => setTimeout(r, 200));
      if (requestIdRef.current !== currentReqId) return;

      // Stage 2: Updating weather
      setLoadingStage('🌤 Updating weather...');
      const updateResult = await apiService.updateLocation(newLocation);
      if (requestIdRef.current !== currentReqId) return;

      // Stage 3: Updating forecast
      setLoadingStage('📊 Updating forecast...');
      const forecastData = await apiService.getForecast({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });
      if (requestIdRef.current !== currentReqId) return;

      // Stage 4: Updating optimization with active mode preserved
      setLoadingStage('🧠 Updating optimization...');
      const optResult = await apiService.runOptimization({
        demand_kw: status?.metrics?.currentDemandKw || 48.2,
        solar_available_kw: status?.metrics?.solarGenKw || 26.4,
        wind_available_kw: status?.metrics?.windGenKw || 15.3,
        battery_soc: status?.metrics?.batterySocPercent || 68.0,
        optimization_mode: optimizationMode,
      });
      if (requestIdRef.current !== currentReqId) return;

      // Stage 5: Finalize
      setLoadingStage('✓ Location updated');

      const updatedActiveLoc = updateResult.activeLocation || newLocation;
      setActiveLocation(updatedActiveLoc);

      if (updateResult.weatherSource) {
        setWeatherSource(updateResult.weatherSource);
      }

      setForecast(forecastData || updateResult.forecast || []);

      // Format safe merged live dispatch with all required metrics
      const safeDispatch = optResult ? {
        ...(optResult.dispatch || {}),
        solarKw: optResult.dispatch?.solarKw ?? optResult.solar_kw ?? 30.0,
        windKw: optResult.dispatch?.windKw ?? optResult.wind_kw ?? 15.0,
        batteryKw: optResult.dispatch?.batteryKw ?? optResult.battery_kw ?? 5.0,
        dieselKw: optResult.dispatch?.dieselKw ?? optResult.diesel_kw ?? 0.0,
        totalSupplyKw: optResult.total_supply_kw ?? optResult.metrics?.totalGenerationKw ?? (
          Number(optResult.dispatch?.solarKw ?? optResult.solar_kw ?? 0) +
          Number(optResult.dispatch?.windKw ?? optResult.wind_kw ?? 0) +
          Number(optResult.dispatch?.batteryKw ?? optResult.battery_kw ?? 0) +
          Number(optResult.dispatch?.dieselKw ?? optResult.diesel_kw ?? 0)
        ),
        demandKw: optResult.demand_kw ?? status?.metrics?.currentDemandKw ?? 48.2,
        status: (optResult.status || 'OPTIMAL').toUpperCase(),
        costPerHour: optResult.metrics?.estimatedCostPerHour ?? optResult.cost_per_hour ?? 4.25,
        dieselSavedLitersDay: 85,
        co2AvoidedKgDay: 142.8,
        reliability: optResult.metrics?.reliabilityPercent ? `${optResult.metrics.reliabilityPercent}% P0 Protected` : '100% P0 Protected',
      } : null;

      // Refresh system status with updated values
      setStatus((prev) => ({
        ...prev,
        activeLocation: updatedActiveLoc,
        weather: updateResult.weather || prev?.weather,
        weatherSource: updateResult.weatherSource || 'LIVE',
        liveDispatch: safeDispatch || prev?.liveDispatch,
      }));

      await new Promise((r) => setTimeout(r, 450));
      if (requestIdRef.current !== currentReqId) return;

      setIsLocationModalOpen(false);
    } catch (err) {
      console.error('Failed to update microgrid location:', err);
      setError(err.message || 'Failed to change location');
    } finally {
      if (requestIdRef.current === currentReqId) {
        setLoading(false);
        setLoadingStage('');
      }
    }
  };

  // WebSockets subscription
  useEffect(() => {
    wsClient.connect();
    fetchStatusAndForecast();

    const unsubscribeStatus = wsClient.on('SYSTEM_STATUS_UPDATED', (data) => {
      setStatus((prev) => {
        if (!prev) return data;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            ...data.metrics,
          },
        };
      });
    });

    const unsubscribeSolar = wsClient.on('SOLAR_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          solar_kw: data.solarGenKw ?? data.solar_kw ?? prev.solar_kw,
          metrics: {
            ...prev.metrics,
            solarGenKw: data.solarGenKw ?? data.solar_kw,
          },
        };
      });
    });

    const unsubscribeWind = wsClient.on('WIND_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          wind_kw: data.windGenKw ?? data.wind_kw ?? prev.wind_kw,
          metrics: {
            ...prev.metrics,
            windGenKw: data.windGenKw ?? data.wind_kw,
          },
        };
      });
    });

    const unsubscribeBattery = wsClient.on('BATTERY_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          battery_soc: data.batterySocPercent ?? data.battery_soc ?? prev.battery_soc,
          battery_kw: data.batteryPowerKw ?? data.battery_kw ?? prev.battery_kw,
          metrics: {
            ...prev.metrics,
            batterySocPercent: data.batterySocPercent ?? data.battery_soc ?? prev.metrics?.batterySocPercent,
            batteryPowerKw: data.batteryPowerKw ?? data.battery_kw ?? prev.metrics?.batteryPowerKw,
          },
        };
      });
    });

    const unsubscribeDieselStart = wsClient.on('DIESEL_STARTED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          diesel_status: 'RUNNING',
          diesel_kw: data.dieselPowerKw ?? 15.0,
          metrics: {
            ...prev.metrics,
            dieselStatus: 'RUNNING',
            dieselPowerKw: data.dieselPowerKw ?? 15.0,
          },
        };
      });
    });

    const unsubscribeDieselStop = wsClient.on('DIESEL_STOPPED', () => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          diesel_status: 'OFF',
          diesel_kw: 0.0,
          metrics: {
            ...prev.metrics,
            dieselStatus: 'OFF',
            dieselPowerKw: 0.0,
          },
        };
      });
    });

    const unsubscribeStorm = wsClient.on('STORM_MODE', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          storm_mode: data.isStormModeActive,
        };
      });
    });

    const unsubscribeLocation = wsClient.on('LOCATION_CHANGED', (data) => {
      if (data && data.name) {
        setActiveLocation(data);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeSolar();
      unsubscribeWind();
      unsubscribeBattery();
      unsubscribeDieselStart();
      unsubscribeDieselStop();
      unsubscribeStorm();
      unsubscribeLocation();
    };
  }, [fetchStatusAndForecast]);

  const value = {
    status,
    activeLocation,
    presets,
    weather: status?.weather || {
      condition: 'Sunny / Clear',
      temperatureC: 28.5,
      solarIrradianceWm2: 820,
      windSpeedMs: 7.2,
    },
    weatherSource,
    metrics: status?.metrics || {},
    forecast,
    optimizationMode,
    setOptimizationMode,
    loading,
    loadingStage,
    error,
    updateLocation,
    refetch: fetchStatusAndForecast,
    isLocationModalOpen,
    setIsLocationModalOpen,
  };

  return (
    <SystemStatusContext.Provider value={value}>
      {children}
    </SystemStatusContext.Provider>
  );
};

export const useSystemStatusContext = () => {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatusContext must be used within a SystemStatusProvider');
  }
  return context;
};
