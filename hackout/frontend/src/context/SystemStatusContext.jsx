import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { wsClient } from '../services/websocket';
import { DEMO_LOCATION } from '../utils/constants';

const SystemStatusContext = createContext(null);

export const SystemStatusProvider = ({ children }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationSwitching, setLocationSwitching] = useState(false);
  const [locationStage, setLocationStage] = useState(''); // Loading status step text

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getSystemStatus();
      setStatus(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load system status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update location through the complete end-to-end flow with sequential loading indicators
  const updateLocation = useCallback(async (payload, onStageUpdate) => {
    setLocationSwitching(true);
    setError(null);

    const setStage = (text) => {
      setLocationStage(text);
      if (onStageUpdate) onStageUpdate(text);
    };

    try {
      // Step 1: Updating location
      setStage('📍 Updating location...');
      await new Promise((r) => setTimeout(r, 250));

      // Step 2: Updating weather
      setStage('🌤 Updating weather...');
      const res = await apiService.setLocation(payload);

      // Step 3: Updating forecast
      setStage('📊 Updating forecast...');
      await new Promise((r) => setTimeout(r, 300));

      // Step 4: Updating optimization
      setStage('🧠 Updating optimization...');
      await new Promise((r) => setTimeout(r, 300));

      // Step 5: Location updated
      setStage('✓ Location updated');

      // Update central state immediately with new location & metrics
      if (res && res.location) {
        setStatus((prev) => ({
          ...prev,
          location: res.location,
          weather: res.weather || prev?.weather,
          metrics: res.metrics || prev?.metrics,
          liveDispatch: res.liveDispatch || prev?.liveDispatch,
        }));
      }

      // Perform a full refresh in background to synchronize all endpoints
      await fetchStatus();

      await new Promise((r) => setTimeout(r, 600));
      return res;
    } catch (err) {
      setError(err.message || 'Failed to switch location');
      throw err;
    } finally {
      setLocationSwitching(false);
      setLocationStage('');
    }
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();

    // Subscribe to WebSocket updates across the entire application once
    const unsubscribeStatus = wsClient.on('SYSTEM_STATUS_UPDATED', (data) => {
      setStatus((prev) => {
        if (!prev) return data;
        return {
          ...prev,
          ...data,
          location: data.location || prev.location,
          weather: data.weather || prev.weather,
          metrics: {
            ...prev.metrics,
            ...data.metrics,
          }
        };
      });
    });

    const unsubscribeLocation = wsClient.on('LOCATION_CHANGED', (locData) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          location: locData,
        };
      });
      fetchStatus();
    });

    const unsubscribeSolar = wsClient.on('SOLAR_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            solarGenKw: data.solarGenKw,
          }
        };
      });
    });

    const unsubscribeWind = wsClient.on('WIND_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            windGenKw: data.windGenKw,
          }
        };
      });
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLocation();
      unsubscribeSolar();
      unsubscribeWind();
    };
  }, [fetchStatus]);

  // Central active location object derived from status or fallback to DEMO_LOCATION
  const activeLocation = status?.location || DEMO_LOCATION;

  return (
    <SystemStatusContext.Provider
      value={{
        status,
        activeLocation,
        loading,
        error,
        locationSwitching,
        locationStage,
        updateLocation,
        refetch: fetchStatus,
      }}
    >
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

export default SystemStatusContext;
