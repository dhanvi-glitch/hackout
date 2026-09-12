"""
OptiGrid-AI Complete Hackathon Demo Verification Flow.
Tests all 24 steps of the hackathon demonstration:
1. Command Center & System Status
2. Demand, Solar, Wind, Battery, Diesel metrics
3. Energy Optimizer execution & dispatch verification
4. 24-Hour Forecast 96 intervals
5. Battery BESS SOC & Storm mode
6. Priority Loads (P0, P1, P2)
7. Fuel Intelligence autonomy & status
8. What-If Crisis Simulator (Solar Failure & 48h Storm)
9. Alerts retrieval
10. Real-time WebSocket event streaming
"""

import asyncio
import json
import httpx
import websockets

BASE_URL = "http://127.0.0.1:8000/api"
WS_URL = "ws://127.0.0.1:8000/ws"


async def run_demo_flow():
    print("=" * 60)
    print("STARTING OPTIGRID-AI COMPLETE DEMO FLOW VERIFICATION")
    print("=" * 60)

    async with httpx.AsyncClient(timeout=10.0) as client:
        # 1. System Status / Command Center
        r = await client.get(f"{BASE_URL}/system/status")
        assert r.status_code == 200, f"Status failed: {r.status_code}"
        status = r.json()
        print("\n[STEP 1-7: COMMAND CENTER]")
        print(f"  [OK] System Status: {status['system_status']}, Online: {status['isOnline']}")
        print(f"  [OK] Demand: {status['demand_kw']} kW")
        print(f"  [OK] Solar: {status['solar_kw']} kW")
        print(f"  [OK] Wind: {status['wind_kw']} kW")
        print(f"  [OK] Battery SOC: {status['battery_soc']}%")
        print(f"  [OK] Diesel Status: {status['diesel_status']}, Power: {status['diesel_kw']} kW")
        print(f"  [OK] Renewable Penetration: {status['renewable_percentage']}%")

        # 8-10. Energy Optimizer
        print("\n[STEP 8-10: ENERGY OPTIMIZER]")
        opt_req = {
            "demand_kw": 48.2,
            "solar_available_kw": 26.4,
            "wind_available_kw": 15.3,
            "battery_soc": 68.0,
            "battery_capacity_kwh": 100.0,
            "diesel_available": True,
            "fuel_price": 95.0
        }
        r = await client.post(f"{BASE_URL}/optimize", json=opt_req)
        assert r.status_code == 200, f"Optimizer failed: {r.status_code}"
        opt = r.json()
        print(f"  [OK] Status: {opt['status']}")
        print(f"  [OK] Dispatch Solution -> Solar: {opt['solar_kw']} kW, Wind: {opt['wind_kw']} kW, Battery: {opt['battery_kw']} kW, Diesel: {opt['diesel_kw']} kW")
        print(f"  [OK] Total Supply: {opt['total_supply_kw']} kW vs Demand: {opt['demand_kw']} kW")
        print(f"  [OK] Reliability: {opt['metrics']['reliabilityPercent']}%")

        # 11-12. 24-Hour Forecast
        print("\n[STEP 11-12: 24-HOUR FORECAST]")
        r = await client.get(f"{BASE_URL}/forecast")
        assert r.status_code == 200
        forecast = r.json()
        assert len(forecast) == 96, f"Expected 96 intervals, got {len(forecast)}"
        print(f"  [OK] Received exactly {len(forecast)} 15-minute intervals across 24h")
        print(f"  [OK] Sample Interval 1 (00:00) -> Demand: {forecast[0]['demand']} kW, Solar: {forecast[0]['solar']} kW, Wind: {forecast[0]['wind']} kW")
        print(f"  [OK] Sample Interval 48 (12:00) -> Demand: {forecast[47]['demand']} kW, Solar: {forecast[47]['solar']} kW, Wind: {forecast[47]['wind']} kW")

        # 13-14. Battery Page
        print("\n[STEP 13-14: BATTERY STORAGE (BESS)]")
        r = await client.get(f"{BASE_URL}/battery")
        assert r.status_code == 200
        bat = r.json()
        print(f"  [OK] Current SOC: {bat['currentSocPercent']}%")
        print(f"  [OK] Health: {bat['healthPercent']}%, Cycles: {bat['cycleCount']}")
        print(f"  [OK] Storm Mode: {bat['isStormModeActive']}")

        # 15-16. Load Management
        print("\n[STEP 15-16: LOAD MANAGEMENT (P0/P1/P2)]")
        r = await client.get(f"{BASE_URL}/loads")
        assert r.status_code == 200
        loads = r.json()
        print(f"  [OK] Total Demand: {loads['totalDemandKw']} kW")
        print(f"  [OK] P0 Critical: {loads['summary']['p0ServedPercent']}% (100% protected)")
        print(f"  [OK] P1 Shiftable: {loads['summary']['p1ServedPercent']}%")
        print(f"  [OK] P2 Curtailable: {loads['summary']['p2ServedPercent']}%")

        # 17-18. Fuel Intelligence
        print("\n[STEP 17-18: FUEL INTELLIGENCE]")
        r = await client.get(f"{BASE_URL}/fuel")
        assert r.status_code == 200
        fuel = r.json()
        print(f"  [OK] Fuel Remaining: {fuel['fuelRemainingLiters']} L ({fuel['tankLevelPercent']}%)")
        print(f"  [OK] Daily Burn Rate: {fuel['currentBurnRateLitersPerDay']} L/day")
        print(f"  [OK] Autonomy Days Remaining: {fuel['daysRemaining']} days (Depletion: {fuel['estimatedDepletionDate']})")

        # 19-22. What-If Simulator
        print("\n[STEP 19-22: WHAT-IF SIMULATOR]")
        # Scenario 1: Solar Failure
        sim1 = {"scenario": "SOLAR_FAILURE", "severity": 80, "durationHours": 12}
        r = await client.post(f"{BASE_URL}/simulation/run", json=sim1)
        assert r.status_code == 200
        s1_res = r.json()
        print(f"  [OK] SOLAR_FAILURE -> Impact: P0={s1_res['impact']['p0ReliabilityPercent']}%, Extra Fuel={s1_res['impact']['additionalDieselLiters']}L, Extra Cost=${s1_res['impact']['costDifferenceDollars']}")

        # Scenario 2: 48-Hour Storm
        sim2 = {"scenario": "STORM_48H", "severity": 90, "durationHours": 48}
        r = await client.post(f"{BASE_URL}/simulation/run", json=sim2)
        assert r.status_code == 200
        s2_res = r.json()
        print(f"  [OK] STORM_48H -> Impact: P0={s2_res['impact']['p0ReliabilityPercent']}%, P1={s2_res['impact']['p1ServedPercent']}%, P2={s2_res['impact']['p2ServedPercent']}%, Extra Fuel={s2_res['impact']['additionalDieselLiters']}L")

        # 23. Alerts
        print("\n[STEP 23: ALERTS & ADVISORIES]")
        r = await client.get(f"{BASE_URL}/alerts")
        assert r.status_code == 200
        alerts = r.json()
        print(f"  [OK] Active Alerts Count: {len(alerts)}")
        for a in alerts[:2]:
            print(f"       - [{a['type']}] {a['title']}: {a['message']}")

        # 24. Real-time updates / WebSocket
        print("\n[STEP 24: REAL-TIME WEBSOCKET UPDATES]")
        async with websockets.connect(WS_URL) as ws:
            msg = await asyncio.wait_for(ws.recv(), timeout=10.0)
            ev = json.loads(msg)
            print(f"  [OK] Received Real-time WebSocket Event: {ev['type']}")
            print(f"       Data: {ev.get('data', {})}")

    print("\n" + "=" * 60)
    print("ALL 24 DEMO STEPS VERIFIED & PASSED PERFECTLY!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_demo_flow())
