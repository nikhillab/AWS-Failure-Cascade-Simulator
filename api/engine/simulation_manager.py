import asyncio

from models.simulation import Scenario, TimelineTick
from engine.websocket_manager import manager


class SimulationManager:
    async def run_simulation(self, simulation_id: str, scenario: Scenario):
        """Run a simulation and broadcast tick updates via WebSocket."""
        current_tick = 0

        await manager.broadcast(
            simulation_id,
            {
                "type": "simulation_started",
                "scenario": scenario.title,
            },
        )

        for timeline_tick in scenario.timeline:
            wait_time = timeline_tick.tick - current_tick

            if wait_time > 0:
                await asyncio.sleep(wait_time)

            current_tick = timeline_tick.tick

            node_updates = []

            for effect in timeline_tick.effects:
                node_updates.append(
                    {
                        "id": effect.node,
                        "state": effect.state,
                        "metrics": {
                            "latency": effect.latency,
                            "errors": effect.errors,
                        },
                    }
                )

            await manager.broadcast(
                simulation_id,
                {
                    "type": "tick",
                    "tick": timeline_tick.tick,
                    "nodes": node_updates,
                },
            )

            narrator_message = self.build_narrator_message(timeline_tick)

            await manager.broadcast(
                simulation_id,
                {
                    "type": "narrator",
                    "tick": timeline_tick.tick,
                    "message": narrator_message,
                },
            )

        await manager.broadcast(
            simulation_id,
            {
                "type": "simulation_completed",
                "scenario": scenario.title,
            },
        )

    @staticmethod
    def build_narrator_message(timeline_tick: TimelineTick) -> str:
        """Generate narrative description for a timeline tick."""
        effect = timeline_tick.effects[0]

        if effect.state == "degraded":
            return (
                f"{effect.node} is experiencing elevated latency and partial service degradation."
            )

        if effect.state == "failing":
            return f"{effect.node} is entering a critical failure state due to cascading pressure."

        if effect.state == "down":
            return f"{effect.node} is now unavailable."

        return f"{effect.node} state updated to {effect.state}."
