# AWS Failure Cascade Simulator
# API Requirements Document

Version: 1.0
Status: Draft

---

# 1. Overview

The backend API powers:

1. Diagram upload
2. AI topology parsing
3. Failure scenario generation
4. Simulation orchestration
5. Narration generation
6. Post-simulation reporting

The backend is responsible for:
- deterministic simulation execution
- topology normalization
- AI orchestration
- event streaming

---

# 2. Tech Stack

## Runtime
- Python
- FastAPI

## AI
- 

## Transport
- REST API
- WebSockets

---

# 3. Core Responsibilities

| Responsibility | Description |
|---|---|
| Upload handling | Accept architecture images |
| LLM orchestration | Parse topology + generate scenarios |
| Topology normalization | Convert raw AI output into canonical graph |
| Simulation execution | Tick-based propagation |
| Event streaming | Stream state updates to UI |
| Reporting | Generate simulation summaries |

---

# 4. API Flow

```text
Client Uploads Diagram
        ↓
POST /api/upload
        ↓
LLM Parser
        ↓
Topology JSON
        ↓
Scenario Strategist
        ↓
Client Receives Graph + Scenarios
        ↓
Client Starts Simulation
        ↓
WebSocket Streams Tick Updates
        ↓
Client Renders Cascade
```

---

# 5. REST Endpoints

# 5.1 Upload Diagram

## Endpoint

```http
POST /api/upload
```

## Content Type

```http
multipart/form-data
```

## Request

| Field | Type |
|---|---|
| file | image |

---

## Response

```json
{
  "simulationId": "sim_123",

  "topology": {
    "nodes": [],
    "edges": []
  },

  "scenarios": []
}
```

---

# 5.2 Get Simulation Metadata

## Endpoint

```http
GET /api/simulations/{id}
```

## Response

```json
{
  "id": "sim_123",
  "status": "ready",
  "createdAt": "2026-05-07T10:00:00Z"
}
```

---

# 5.3 Start Simulation

## Endpoint

```http
POST /api/simulations/{id}/start
```

## Request

```json
{
  "scenarioId": "scenario_1"
}
```

## Response

```json
{
  "status": "started"
}
```

---

# 5.4 Reset Simulation

## Endpoint

```http
POST /api/simulations/{id}/reset
```

---

# 5.5 Generate Report

## Endpoint

```http
POST /api/simulations/{id}/report
```

## Response

```json
{
  "summary": "",
  "blastRadius": {},
  "recommendations": []
}
```

---

# 6. WebSocket API

# Endpoint

```text
/ws/simulations/{id}
```

---

# 7. WebSocket Events

## Tick Update Event

```json
{
  "type": "tick",

  "tick": 12,

  "nodes": [
    {
      "id": "ecs-1",
      "state": "degraded",
      "metrics": {
        "latency": 320,
        "errors": 0.14
      }
    }
  ],

  "edges": [
    {
      "source": "ecs-1",
      "target": "rds-1",
      "state": "degraded"
    }
  ]
}
```

---

## Narrator Event

```json
{
  "type": "narrator",

  "tick": 12,

  "message": "ECS retries increased sharply after Aurora latency crossed timeout thresholds."
}
```

---

## Log Event

```json
{
  "type": "log",

  "level": "warning",

  "message": "Connection pool exhaustion detected."
}
```

---

# 8. Canonical Topology Schema

## Node

```json
{
  "id": "ecs-1",
  "type": "ecs",
  "label": "ECS Service",
  "tier": "compute"
}
```

---

## Edge

```json
{
  "source": "ecs-1",
  "target": "rds-1",
  "mode": "sync"
}
```

---

# 9. Scenario Schema

```json
{
  "id": "scenario_1",

  "title": "Aurora Latency Spike",

  "severity": "High",

  "trigger": {
    "node": "aurora-1",
    "type": "latency_spike"
  },

  "timeline": [
    {
      "tick": 0,

      "effects": [
        {
          "node": "aurora-1",
          "state": "degraded"
        }
      ]
    }
  ]
}
```

---

# 10. Cascade Engine

# Responsibilities

The engine must:
- execute deterministic propagation
- update node states
- compute degradation
- emit timeline events
- maintain replay history

---

# 11. Tick Model

## Tick Interval
Default:
- 1 second

Configurable later.

---

## Tick Loop

```text
for each tick:
  evaluate dependencies
  propagate failures
  update metrics
  emit events
  persist snapshot
```

---

# 12. Node States

| State | Description |
|---|---|
| healthy | Operating normally |
| degraded | Elevated latency/errors |
| failing | Severe instability |
| down | Unavailable |
| recovering | Returning to healthy |

---

# 13. Dependency Modes

| Mode | Behavior |
|---|---|
| sync | Immediate propagation |
| async | Buffered propagation |

---

# 14. AI Responsibilities

## AI Handles
- topology extraction
- dependency inference
- scenario generation
- narrator messaging
- resiliency recommendations

## AI Does NOT Handle
- runtime simulation
- propagation execution
- state management
- tick orchestration

---

# 15. LLM Prompting Requirements

## Parser Prompt
Must return:
- nodes
- edges
- tiers
- dependency modes

---

## Scenario Prompt
Must return:
- trigger event
- propagation timeline
- severity
- summary

---

# 16. Persistence

## MVP
In-memory only.

---

## Future
Use PostgreSQL for:
- saved simulations
- replay history
- reports
- user projects

---

# 17. Error Handling

## Upload Errors
- invalid image
- oversized file
- unsupported format

## AI Errors
- malformed JSON
- timeout
- parsing ambiguity

## Simulation Errors
- invalid topology
- missing dependencies
- invalid scenario timeline

---

# 18. Security

## Requirements
- API keys remain server-side
- file validation required
- request size limits enforced

---

# 19. Performance Targets

| Metric | Target |
|---|---|
| Upload parse time | <10 seconds |
| Tick latency | <100ms |
| Max nodes | 40 |
| Max edges | 80 |

---