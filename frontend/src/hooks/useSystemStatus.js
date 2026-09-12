/**
 * Hook to consume central OptiGrid SystemStatusContext.
 * Maintains 100% backward compatibility for existing callers.
 */

import { useContext } from 'react';
import { SystemStatusContext } from '../context/SystemStatusContext';

export const useSystemStatus = () => {
  const context = useContext(SystemStatusContext);
  if (!context) {
    // If somehow accessed outside provider, return default fallback structure
    return {
      status: null,
      activeLocation: null,
      presets: [],
      weather: null,
      weatherSource: 'LIVE',
      metrics: {},
      forecast: [],
      optimizationMode: 'balanced',
      setOptimizationMode: () => {},
      loading: false,
      loadingStage: '',
      error: 'SystemStatusContext not found',
      updateLocation: async () => {},
      refetch: async () => {},
      isLocationModalOpen: false,
      setIsLocationModalOpen: () => {},
    };
  }
  return context;
};

export default useSystemStatus;
