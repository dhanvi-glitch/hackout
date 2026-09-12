import axios from 'axios';
import {
  initialSystemStatus,
  generate24HourForecast,
  batteryDetailsMock,
  fuelIntelligenceMock,
  loadManagementMock,
  initialAlerts,
  runMockOptimization,
  runMockSimulation,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // GET /api/system/status
  getSystemStatus: async () => {
    try {
      const response = await apiClient.get('/system/status');
      return response.data;
    } catch (err) {
      console.warn('API /system/status unreachable, returning mock data:', err.message);
      return initialSystemStatus;
    }
  },

  // GET /api/forecast
  getForecast: async () => {
    try {
      const response = await apiClient.get('/forecast');
      return response.data;
    } catch (err) {
      console.warn('API /forecast unreachable, returning mock data:', err.message);
      return generate24HourForecast();
    }
  },

  // GET /api/battery
  getBatteryStatus: async () => {
    try {
      const response = await apiClient.get('/battery');
      return response.data;
    } catch (err) {
      console.warn('API /battery unreachable, returning mock data:', err.message);
      return batteryDetailsMock;
    }
  },

  // GET /api/fuel
  getFuelStatus: async () => {
    try {
      const response = await apiClient.get('/fuel');
      return response.data;
    } catch (err) {
      console.warn('API /fuel unreachable, returning mock data:', err.message);
      return fuelIntelligenceMock;
    }
  },

  // GET /api/loads
  getLoadStatus: async () => {
    try {
      const response = await apiClient.get('/loads');
      return response.data;
    } catch (err) {
      console.warn('API /loads unreachable, returning mock data:', err.message);
      return loadManagementMock;
    }
  },

  // GET /api/dispatch/latest
  getLatestDispatch: async () => {
    try {
      const response = await apiClient.get('/dispatch/latest');
      return response.data;
    } catch (err) {
      console.warn('API /dispatch/latest unreachable, returning mock data:', err.message);
      return initialSystemStatus.liveDispatch;
    }
  },

  // GET /api/dispatch/history
  getDispatchHistory: async () => {
    try {
      const response = await apiClient.get('/dispatch/history');
      return response.data;
    } catch (err) {
      console.warn('API /dispatch/history unreachable, returning mock data:', err.message);
      return generate24HourForecast().slice(0, 24);
    }
  },

  // GET /api/alerts
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return response.data;
    } catch (err) {
      console.warn('API /alerts unreachable, returning mock data:', err.message);
      return initialAlerts;
    }
  },

  // POST /api/optimize
  runOptimization: async (payload) => {
    try {
      const response = await apiClient.post('/optimize', payload);
      return response.data;
    } catch (err) {
      console.warn('API /optimize unreachable, executing client-side mock optimization:', err.message);
      // Simulate network delay for realistic UX feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      return runMockOptimization(payload);
    }
  },

  // POST /api/simulation/run
  runSimulation: async (payload) => {
    try {
      const response = await apiClient.post('/simulation/run', payload);
      return response.data;
    } catch (err) {
      console.warn('API /simulation/run unreachable, executing client-side mock simulation:', err.message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return runMockSimulation(payload);
    }
  },

  // POST /api/weather/refresh
  refreshWeather: async () => {
    try {
      const response = await apiClient.post('/weather/refresh');
      return response.data;
    } catch (err) {
      console.warn('API /weather/refresh unreachable, returning updated mock weather:', err.message);
      return {
        status: 'success',
        weather: {
          condition: 'Sunny / Clear',
          temperatureC: 29.2,
          solarIrradianceWm2: 890,
          windSpeedMs: 8.1,
          lastUpdated: new Date().toISOString(),
        }
      };
    }
  },

  // GET /api/location
  getLocation: async () => {
    try {
      const response = await apiClient.get('/location');
      return response.data;
    } catch (err) {
      console.warn('API /location unreachable, using default location:', err.message);
      return { status: 'success', location: initialSystemStatus.location };
    }
  },

  // GET /api/location/presets
  getLocationPresets: async () => {
    try {
      const response = await apiClient.get('/location/presets');
      return response.data.presets;
    } catch (err) {
      console.warn('API /location/presets unreachable, using fallback presets:', err.message);
      return [
        {
          id: "dhordo_gujarat",
          name: "Dhordo",
          district: "Kutch",
          state: "Gujarat",
          country: "India",
          community: "Dhordo Community Microgrid",
          latitude: 23.84,
          longitude: 69.76,
          climate: "Arid / High Solar Irradiance & Strong Coastal Winds"
        },
        {
          id: "pokhran_rajasthan",
          name: "Pokhran",
          district: "Jaisalmer",
          state: "Rajasthan",
          country: "India",
          community: "Pokhran Thar Microgrid",
          latitude: 26.92,
          longitude: 71.91,
          climate: "Hot Desert / Extreme Solar Influx"
        },
        {
          id: "baramati_maharashtra",
          name: "Baramati Rural",
          district: "Pune",
          state: "Maharashtra",
          country: "India",
          community: "Baramati Agro-Community Grid",
          latitude: 18.15,
          longitude: 74.58,
          climate: "Semi-Arid Deccan / High Agricultural Pumping Demand"
        },
        {
          id: "rameshwaram_tamil_nadu",
          name: "Rameshwaram Coastal",
          district: "Ramanathapuram",
          state: "Tamil Nadu",
          country: "India",
          community: "Rameshwaram Coastal Island Microgrid",
          latitude: 9.28,
          longitude: 79.31,
          climate: "Tropical Coastal / High Year-Round Wind"
        },
        {
          id: "hampi_karnataka",
          name: "Hampi Rural",
          district: "Vijayanagara",
          state: "Karnataka",
          country: "India",
          community: "Tungabhadra Heritage Microgrid",
          latitude: 15.33,
          longitude: 76.46,
          climate: "Deccan Plateau / Moderate Solar & Steady Winds"
        },
        {
          id: "spiti_himachal",
          name: "Kaza, Spiti Valley",
          district: "Lahaul & Spiti",
          state: "Himachal Pradesh",
          country: "India",
          community: "Spiti High-Altitude Cold Microgrid",
          latitude: 32.24,
          longitude: 78.03,
          climate: "Cold Mountain Desert / Sub-Zero High Altitude"
        },
        {
          id: "mandla_madhya_pradesh",
          name: "Mandla Forest Border",
          district: "Mandla",
          state: "Madhya Pradesh",
          country: "India",
          community: "Kanha Tribal Community Microgrid",
          latitude: 22.60,
          longitude: 80.37,
          climate: "Central Subtropical Forest"
        }
      ];
    }
  },

  // POST /api/location
  setLocation: async (payload) => {
    try {
      const response = await apiClient.post('/location', payload);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        throw new Error(err.response.data.detail);
      }
      throw new Error(err.message || 'Failed to update location');
    }
  },
};
