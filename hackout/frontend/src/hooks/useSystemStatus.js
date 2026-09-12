import { useSystemStatusContext } from '../context/SystemStatusContext';

/**
 * Hook to access centralized single source of truth for microgrid telemetry and active location.
 */
export const useSystemStatus = () => {
  return useSystemStatusContext();
};

export default useSystemStatus;
