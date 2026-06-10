from pydantic import BaseModel
from typing import List, Dict, Optional, Literal


NodeState = Literal[
    "healthy",
    "degraded",
    "failing",
    "down",
    "recovering",
]


class Node(BaseModel):
    id: str
    type: str
    label: str
    tier: str
    lane: str | None = None
    xHint: int | None = None


class Edge(BaseModel):
    source: str
    target: str
    mode: Literal["sync", "async"]


class Effect(BaseModel):
    node: str
    state: NodeState
    latency: Optional[int] = None
    errors: Optional[float] = None


class TimelineTick(BaseModel):
    tick: int
    effects: List[Effect]


class Trigger(BaseModel):
    node: str
    type: str


class Scenario(BaseModel):
    id: str
    title: str
    severity: Literal["Low", "Medium", "High"]
    trigger: Trigger
    summary: str
    timeline: List[TimelineTick]


class StartSimulationRequest(BaseModel):
    scenarioId: str


class Topology(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class ScenariosOut(BaseModel):
    """Wrapper for Agno agent response that returns a list of scenarios."""
    scenarios: List[Scenario]