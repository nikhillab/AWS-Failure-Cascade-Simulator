"""Refined prompt templates for Agno agents.

Keep human-readable context, schema expectations, and small examples
so the agent returns structured JSON compatible with the project's
Pydantic models in `models/simulation.py`.
"""
from typing import Any
import json

from models.simulation import Topology


TOPOLOGY_PROMPT = (
    "You are an assistant that extracts AWS cloud architecture topologies from images.\n"
    "Return a single JSON object that exactly matches the Topology schema: "
    "{'nodes': [Node], 'edges': [Edge]}.\n\n"
    "Node fields: id (unique string), type (service type e.g. 'alb','ecs','aurora','sqs','lambda','dynamodb','cloudfront'),\n"
    "label (human-friendly), tier (one of: 'edge','ingress','compute','data','async'), lane (availability zone or 'regional' or null), xHint (integer horizontal position).\n\n"
    "Edge fields: source (node id), target (node id), mode ('sync' or 'async').\n\n"
    "Provide only valid JSON in your response. Avoid extra commentary. If a field is unknown, use null.\n\n"
    "Example output:\n"
    "{\"nodes\": [{\"id\":\"alb-1\",\"type\":\"alb\",\"label\":\"Application Load Balancer\",\"tier\":\"ingress\",\"lane\":\"az-a\",\"xHint\":1}],"
    "\"edges\": [{\"source\":\"alb-1\",\"target\":\"ecs-a\",\"mode\":\"sync\"}] }\n"
)


SCENARIO_PROMPT = SCENARIO_PROMPT = """
    You are a Site Reliability Engineering (SRE) simulation assistant.

    Your task is to analyze a canonical topology and architecture diagram of AWS and generate realistic infrastructure failure scenarios that can be used in a resilience or chaos-engineering simulation.

    OUTPUT REQUIREMENTS
    - Return ONLY valid JSON.
    - Return a single JSON object with a top-level key: "scenarios".
    - "scenarios" must be an array of scenario objects.
    - Do not include markdown, explanations, comments, or code fences.
    - For each Component generate at least one scenario

    SCENARIO SCHEMA

    Each scenario must contain:

    {
    "id": "string",
    "title": "string",
    "severity": "Low|Medium|High",
    "trigger": {
        "node": "node-id",
        "type": "failure-type"
    },
    "summary": "one-sentence description",
    "timeline": [
        {
        "tick": integer,
        "effects": [
            {
            "node": "node-id",
            "state": "healthy|degraded|failing|down|recovering",
            "latency": integer|null,
            "errors": float|null
            }
        ]
        }
    ]
    }

    SCENARIO DESIGN RULES

    1. Use only node IDs that exist in the provided topology.
    2. Generate realistic distributed-system failure modes, including:
        - latency spikes
        - service degradation
        - database saturation
        - cache failures
        - network partition events
        - dependency outages
        - message queue backlogs
        - resource exhaustion
        - partial regional failures
    3. Vary severity levels across scenarios.
    4. Vary impacted services and infrastructure components.
    5. Prefer cascading effects that propagate through dependencies.
    6. Timelines should show progression over time:
        - initial trigger
        - impact propagation
        - peak failure
        - recovery (when appropriate)
    7. Use 3-8 ticks per scenario.
    8. Tick values must be monotonically increasing.
    9. Latency values represent milliseconds.
    10. Error values must be floats between 0.0 and 1.0.
    11. Set latency and errors to null when not applicable.
    12. Ensure downstream services exhibit realistic symptoms when dependencies fail.
    13. Avoid impossible transitions (e.g., healthy → recovering without prior degradation or failure).

    STATE TRANSITION GUIDELINES

    Typical progression:
    healthy → degraded → failing → down → recovering → healthy

    NOTE: Please use the Node ID provided as that will be used in UI.

    Examples:
    - Database latency spike causing API degradation and retry storms.
    - Cache outage increasing database load and response times.
    - Message queue backlog delaying asynchronous processing.
    - Network partition isolating dependent services.
    - Resource exhaustion leading to cascading failures.

    Return only the JSON object.
    """


def topology_prompt_with_example() -> str:
    """Return the base topology prompt (kept as a function for future templating)."""
    return TOPOLOGY_PROMPT

def generate_node_name(topology: Topology)-> str:
    return ",".join(str(id) for id in topology.nodes)


def scenarios_prompt_for_topology(topology: Topology) -> str:
    """Return a scenarios prompt that includes the topology JSON inline (compact)."""

    return SCENARIO_PROMPT +"\n Node ID List :"+generate_node_name(topology)
