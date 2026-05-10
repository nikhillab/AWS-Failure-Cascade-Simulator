# AWS Failure Cascade Simulator
# UI Requirements Document
Version: 1.0
Status: Draft
# 1. Overview
The UI is an interactive infrastructure visualization platform that allows users to:
1. Upload AWS architecture diagrams
2. View parsed topology as an interactive graph
3. Run AI-generated failure simulations
4. Watch cascading failures propagate in real time
5. Inspect node behavior and blast radius
6. Review post-simulation resiliency insights

The interface should feel:
- technical
- modern
- responsive
- explainable
- visually dynamic

The UI is optimized for desktop usage only.

# 2. Tech Stack

## Core
- React
- TypeScript
- Vite

## Visualization
- React Flow
- Framer Motion

## Styling

## State Management
# 3. Layout Structure

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                      │
├───────────────┬──────────────────────────────────────────────┤
│ Scenario Panel│ Topology Canvas                             │
│               │                                              │
│               │                                              │
│               │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ Timeline Controls + Narrator + Cascade Log                  │
└──────────────────────────────────────────────────────────────┘
```
# 4. Core Screens

## 4.1 Upload Screen

### Purpose
Allow users to upload an architecture diagram.

### Features
- Drag and drop upload area
- File picker button
- Upload progress indicator
- Supported file types:
  - PNG
  - JPG
  - JPEG

### Constraints
- Max file size: 10MB
- Single image only

### States
- Empty
- Uploading
- Parsing
- Error
- Success

### Success Output
Display:
- filename
- number of detected nodes
- number of generated scenarios
## 4.2 Topology Canvas

### Purpose
Render interactive infrastructure topology.

### Requirements
- Use React Flow
- Pan + zoom support
- Responsive layout
- Dark theme

### Topology Layout Rules

#### Vertical Tiering
Nodes grouped by infrastructure tier:

1. Edge
2. Compute
3. Async
4. Data
5. External

#### Horizontal Grouping
Optional AZ swimlane grouping.
# 5. Node Design

## Node Card Content

Each node displays:
- AWS service icon
- service label
- current state color
- small metrics strip

Example:

```text
┌──────────────────┐
│ ECS Service      │
│ CPU: 78%         │
│ ERR: 12%         │
└──────────────────┘
```
## Node States

| State | Color |
|||
| healthy | green |
| degraded | yellow |
| failing | orange |
| down | red |
| recovering | blue |

### State Transitions
- Smooth animated transitions
- Duration: 300–500ms

# 6. Edge Design

## Edge Types

### Sync Dependencies
- Solid line

### Async Dependencies
- Dashed line

## Edge State Colors

| State | Color |
|||
| healthy | green |
| degraded | yellow |
| failing | red |

# 7. Simulation Controls

## Required Controls

| Control | Action |
|||
| Play | Start simulation |
| Pause | Pause simulation |
| Reset | Reset topology |
| Step | Advance single tick |

## Timeline Scrubber

### Purpose
Allow replay and timeline inspection.

### Requirements
- Draggable slider
- Current tick indicator
- Total duration display

Example:

```text
[t=0 ─────●──────── t=45s]
```

# 8. Scenario Panel

## Purpose
Display generated failure scenarios.

## Requirements

Each scenario item displays:
- title
- severity
- trigger node

### Active Scenario
Highlighted visually.

### Interaction
Clicking scenario:
- resets current simulation
- loads selected timeline

# 9. AI Narrator Panel

## Purpose
Explain cascading behavior in plain English.

## Behavior
Updates during simulation playback.

### Example Messages

```text
t+12s:
Aurora latency exceeded retry thresholds.
ECS services are experiencing connection pool exhaustion.
```

# 10. Cascade Log

## Purpose
Provide structured event history.

## Event Types

| Type | Example |
|||
| Failure | RDS unavailable |
| Degradation | ECS latency increased |
| Recovery | ALB recovered |

### Requirements
- Auto-scroll
- Timestamped entries
- Fade-in animation

# 11. Inspector Drawer

## Purpose
Detailed node inspection.

## Trigger
Clicking any node.

## Content
- Node metadata
- Current metrics
- Dependency list
- Upstream services
- Downstream services
- Tick history
- AI explanation

# 12. Blast Radius Visualization

## Purpose
Highlight propagation impact.

## Requirements
- Highlight affected nodes
- Highlight affected edges
- Time-to-impact labels
- Animated propagation glow

# 13. Post-Simulation Report

## Sections

### Summary
High-level simulation outcome.

### Root Cause Chain
Ordered propagation path.

### Blast Radius Metrics
- affected nodes
- peak latency
- peak error rate

### AI Recommendations
Suggested resiliency improvements.

# 14. State Management

## Zustand Store Responsibilities

Store:
- topology
- node states
- edge states
- simulation ticks
- playback controls
- selected scenario
- narrator messages
- event log

# 15. Animation Requirements

## Required Animations
- Node color transitions
- Edge highlight transitions
- Tick progression
- Narrator updates
- Log fade-ins

## Avoid
- Heavy particle systems
- Expensive canvas effects
- Complex physics animations

# 16. Performance Constraints

## Target Limits
- 40 nodes max
- 80 edges max
- 60 FPS during playback
# 17. Accessibility

## Requirements
- Keyboard accessible controls
- High contrast state colors
- Tooltips for node labels