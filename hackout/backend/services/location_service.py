"""
Central Single Source of Truth for Dynamic Rural Location State in OptiGrid-AI.
Supports dynamic switching among rural communities across India.
"""

import threading
from typing import Dict, Any, List, Optional


# Curated presets of diverse rural locations across India for microgrid demonstration
INDIA_RURAL_PRESETS: List[Dict[str, Any]] = [
    {
        "id": "dhordo_gujarat",
        "name": "Dhordo",
        "district": "Kutch",
        "state": "Gujarat",
        "country": "India",
        "community": "Dhordo Community Microgrid",
        "latitude": 23.84,
        "longitude": 69.76,
        "climate": "Arid / High Solar Irradiance & Strong Coastal Winds",
        "description": "Remote desert village near the Great Rann of Kutch with high solar insolation and consistent wind currents."
    },
    {
        "id": "pokhran_rajasthan",
        "name": "Pokhran",
        "district": "Jaisalmer",
        "state": "Rajasthan",
        "country": "India",
        "community": "Pokhran Thar Microgrid",
        "latitude": 26.92,
        "longitude": 71.91,
        "climate": "Hot Desert / Extreme Solar Influx",
        "description": "Thar Desert rural settlement characterized by intense direct normal solar irradiance and desert dust conditions."
    },
    {
        "id": "baramati_maharashtra",
        "name": "Baramati Rural",
        "district": "Pune",
        "state": "Maharashtra",
        "country": "India",
        "community": "Baramati Agro-Community Grid",
        "latitude": 18.15,
        "longitude": 74.58,
        "climate": "Semi-Arid Deccan / High Agricultural Pumping Demand",
        "description": "Agricultural belt in Western Ghats rain shadow with high water well pumping and cold-storage refrigeration loads."
    },
    {
        "id": "rameshwaram_tamil_nadu",
        "name": "Rameshwaram Coastal",
        "district": "Ramanathapuram",
        "state": "Tamil Nadu",
        "country": "India",
        "community": "Rameshwaram Coastal Island Microgrid",
        "latitude": 9.28,
        "longitude": 79.31,
        "climate": "Tropical Coastal / High Year-Round Wind & Marine Humidity",
        "description": "Coastal and island rural microgrid with superior offshore wind resource and tropical monsoon humidity."
    },
    {
        "id": "hampi_karnataka",
        "name": "Hampi Rural",
        "district": "Vijayanagara",
        "state": "Karnataka",
        "country": "India",
        "community": "Tungabhadra Heritage Microgrid",
        "latitude": 15.33,
        "longitude": 76.46,
        "climate": "Deccan Plateau / Moderate Solar & Steady Winds",
        "description": "Rocky terrain agrarian village near the Tungabhadra basin with balanced solar and diurnal wind resources."
    },
    {
        "id": "spiti_himachal",
        "name": "Kaza, Spiti Valley",
        "district": "Lahaul & Spiti",
        "state": "Himachal Pradesh",
        "country": "India",
        "community": "Spiti High-Altitude Cold Microgrid",
        "latitude": 32.24,
        "longitude": 78.03,
        "climate": "Cold Mountain Desert / Extreme Sub-Zero Temperatures",
        "description": "High-altitude Himalayan valley (3,600m MSL) with pristine UV solar irradiance and heavy winter heating loads."
    },
    {
        "id": "mandla_madhya_pradesh",
        "name": "Mandla Forest Border",
        "district": "Mandla",
        "state": "Madhya Pradesh",
        "country": "India",
        "community": "Kanha Tribal Community Microgrid",
        "latitude": 22.60,
        "longitude": 80.37,
        "climate": "Central Subtropical Forest / Seasonal Monsoon",
        "description": "Forested rural tribal settlement where decentralized microgrid power protects healthcare and water sanitation."
    }
]


class LocationManager:
    """Thread-safe manager for the currently active rural microgrid demonstration location."""

    def __init__(self):
        self._lock = threading.Lock()
        # Default starting location is Dhordo, Kutch, Gujarat
        default = INDIA_RURAL_PRESETS[0]
        self._active_location: Dict[str, Any] = {
            "name": f"{default['name']}, {default['district']}, {default['state']}, {default['country']}",
            "shortName": f"{default['name']}, {default['district']}",
            "village": default["name"],
            "district": default["district"],
            "state": default["state"],
            "country": default["country"],
            "community": default["community"],
            "latitude": default["latitude"],
            "longitude": default["longitude"],
            "climate": default.get("climate", "Rural Microgrid Environment"),
            "description": default.get("description", "")
        }

    def get_active_location(self) -> Dict[str, Any]:
        with self._lock:
            return dict(self._active_location)

    def set_location(
        self,
        name: str,
        latitude: float,
        longitude: float,
        district: Optional[str] = None,
        state: Optional[str] = None,
        country: str = "India",
        community: Optional[str] = None,
        climate: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Updates the active location after validating coordinates are within India bounds.
        """
        is_valid, err_msg = self.validate_india_coordinates(latitude, longitude)
        if not is_valid:
            raise ValueError(err_msg)

        with self._lock:
            short_name = f"{name}, {district}" if district else name
            full_name = f"{name}, {district}, {state}, {country}" if district and state else name
            comm_name = community or f"{name} Community Microgrid"

            self._active_location = {
                "name": full_name,
                "shortName": short_name,
                "village": name,
                "district": district or "Rural District",
                "state": state or "Rural State",
                "country": country,
                "community": comm_name,
                "latitude": round(float(latitude), 4),
                "longitude": round(float(longitude), 4),
                "climate": climate or "Rural Indian Microgrid Climate",
                "description": description or f"Decentralized off-grid community microgrid serving {name}."
            }
            return dict(self._active_location)

    @staticmethod
    def validate_india_coordinates(latitude: float, longitude: float) -> tuple[bool, Optional[str]]:
        """
        Validates that latitude and longitude represent a realistic geographic location in or near India:
        Latitude: 6.0 to 38.0 N
        Longitude: 68.0 to 98.0 E
        """
        if not (-90.0 <= latitude <= 90.0):
            return False, f"Invalid latitude {latitude}. Latitude must be between -90 and 90."
        if not (-180.0 <= longitude <= 180.0):
            return False, f"Invalid longitude {longitude}. Longitude must be between -180 and 180."

        # India bounding box check
        if not (6.0 <= latitude <= 38.0 and 68.0 <= longitude <= 98.0):
            return False, "Please select a rural location within India (Latitude: 6°N - 38°N, Longitude: 68°E - 98°E)."

        return True, None

    def get_presets(self) -> List[Dict[str, Any]]:
        return INDIA_RURAL_PRESETS


location_manager = LocationManager()
validate_india_coordinates = LocationManager.validate_india_coordinates
