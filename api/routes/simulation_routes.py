from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
from uuid import uuid4
from datetime import datetime
import asyncio

from models.simulation import StartSimulationRequest, Scenario, Topology
from data.topology import generate_mock_topology
from data.scenarios import generate_mock_scenarios
from engine.simulation_manager import SimulationManager
from engine.websocket_manager import manager
from engine.llm_manager import llm_manager


router = APIRouter(tags=["simulation"])
simulation_manager = SimulationManager()

# In-memory storage for simulations
SIMULATIONS = {}


@router.post("/api/upload")
async def upload_diagram(file: UploadFile = File(...)):
    """Upload a diagram and generate topology + scenarios."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file")

    simulation_id = str(uuid4())

    # Read uploaded image bytes
    image_bytes = await file.read()

    # Try LLM-based parsing; fall back to mock generators on failure
    # try:
    #     nodes, edges = await llm_manager.parse_topology(image_bytes)
    #     topology = Topology(nodes=nodes, edges=edges)
    #     scenarios = await llm_manager.generate_scenarios(topology, image_bytes)
    # except Exception:
    # topology_nodes, topology_edges = generate_mock_topology()
    # scenarios = generate_mock_scenarios()
    # nodes, edges = topology_nodes, topology_edges

    nodes, edges = await llm_manager.parse_topology(image_bytes)
    topology = Topology(nodes=nodes, edges=edges)
    scenarios = await llm_manager.generate_scenarios(image_bytes,topology)

    print(scenarios)

    SIMULATIONS[simulation_id] = {
        "id": simulation_id,
        "filename": file.filename,
        "createdAt": datetime.utcnow().isoformat(),
        "topology": {
            "nodes": [node.dict() for node in nodes],
            "edges": [edge.dict() for edge in edges],
        },
        "scenarios": [scenario.dict() for scenario in scenarios],
    }

    return {
        "simulationId": simulation_id,
        "topology": SIMULATIONS[simulation_id]["topology"],
        "scenarios": SIMULATIONS[simulation_id]["scenarios"],
    }


@router.get("/api/simulations/{simulation_id}")
async def get_simulation(simulation_id: str):
    """Get simulation details."""
    simulation = SIMULATIONS.get(simulation_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    return simulation


@router.post("/api/simulations/{simulation_id}/start")
async def start_simulation(simulation_id: str, body: StartSimulationRequest):
    """Start a simulation for a given scenario."""
    simulation = SIMULATIONS.get(simulation_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    scenario_data = next(
        (
            scenario
            for scenario in simulation["scenarios"]
            if scenario["id"] == body.scenarioId
        ),
        None,
    )

    if not scenario_data:
        raise HTTPException(status_code=404, detail="Scenario not found")

    scenario = Scenario(**scenario_data)

    asyncio.create_task(simulation_manager.run_simulation(simulation_id, scenario))

    return {
        "status": "started",
        "scenario": scenario.title,
    }


@router.post("/api/simulations/{simulation_id}/reset")
async def reset_simulation(simulation_id: str):
    """Reset a simulation."""
    simulation = SIMULATIONS.get(simulation_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    await manager.broadcast(
        simulation_id,
        {
            "type": "reset",
            "message": "Simulation reset",
        },
    )

    return {
        "status": "reset",
    }


@router.post("/api/simulations/{simulation_id}/report")
async def generate_report(simulation_id: str):
    """Generate a post-simulation report."""
    simulation = SIMULATIONS.get(simulation_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    return {
        "summary": "Aurora latency propagated upstream causing ECS retry storms and elevated ALB latency.",
        "blastRadius": {
            "affectedNodes": 4,
            "peakLatency": 1200,
            "peakErrorRate": 0.31,
        },
        "recommendations": [
            "Add circuit breakers between ECS and Aurora",
            "Introduce Aurora read replicas",
            "Reduce retry amplification thresholds",
            "Buffer writes through SQS",
        ],
    }


@router.websocket("/ws/simulations/{simulation_id}")
async def simulation_websocket(websocket: WebSocket, simulation_id: str):
    """WebSocket endpoint for streaming simulation updates."""
    await manager.connect(simulation_id, websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(simulation_id, websocket)
