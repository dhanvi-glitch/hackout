# OptiGrid-AI Team Contract & Architecture Specification

## Team Roles & Ownership

| Member | Domain | Module Path | Responsibilities | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | Frontend Web App | `frontend/` | React 18 + Vite dashboard, Tailwind CSS, Lucide icons, Recharts visualizations, interactive pages for Command Center, Energy Optimizer, 24h Forecast, Battery BESS, Load Priorities, Fuel Intelligence, What-If Simulator, and Settings. | **COMPLETED** |
| **Member 2** | Backend & API | `backend/` | FastAPI asynchronous web framework, SQLAlchemy ORM with SQLite, REST API routers (`/api/*`), Swagger/ReDoc interactive docs, real-time WebSocket telemetry engine (`/ws`), service layers, background telemetry publisher. | **COMPLETED** |
| **Member 3** | Optimization Engine | `optimization/` | PuLP Mixed-Integer Linear Programming (MILP) mathematical formulation, Model Predictive Control (MPC) rolling-horizon framework, battery degradation, diesel operational constraints (minimum loading 30%), P0/P1/P2 priority load curtailment, and deterministic fail-safe fallback. | **COMPLETED** |
| **Member 4** | Data & Environment | `data/` | Synthetic village load profiles (24h/48h), solar & wind physical generation curves, 96-timestep forecasting pipelines, Open-Meteo & NASA POWER meteorological integration with resilience fallback hierarchy (`LIVE` → `CACHED` → `FALLBACK`), fuel autonomy logistics, and what-if crisis simulator presets. | **COMPLETED** |

---

## High-Level Integration Architecture

```text
       [ External Satellite / Weather APIs ]
        (Open-Meteo & NASA POWER)
                   │
                   ▼
       ┌────────────────────────┐
       │   Member 4: DATA       │
       │ Weather, Load, Forecast│
       └───────────┬────────────┘
                   │ get_mpc_inputs()
                   ▼
       ┌────────────────────────┐
       │ Member 3: OPTIMIZATION │
       │ MILP / MPC Solver      │
       └───────────┬────────────┘
                   │ optimize_dispatch()
                   ▼
       ┌────────────────────────┐
       │   Member 2: BACKEND    │ ◄───► [ SQLite Database ]
       │ FastAPI & WebSocket    │       (optigrid.db)
       └───────────▲────────────┘
                   │ REST (/api) & WS (/ws)
                   ▼
       ┌────────────────────────┐
       │   Member 1: FRONTEND   │
       │ React Vite Dashboard   │
       └────────────────────────┘
```
