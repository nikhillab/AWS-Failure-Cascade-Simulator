import os
import tempfile
import json
from typing import List, Tuple

from models.simulation import Node, Edge, Topology, Scenario, ScenariosOut
from engine.prompts import topology_prompt_with_example, scenarios_prompt_for_topology

from agno.agent import Agent
from agno.media import Image
from agno.models.google import Gemini

HAS_AGNO = True



class LLMManager:
    """Adapter to call Agno `Agent` for multimodal image processing.

    Implementation follows the Agno examples:
    - Use `Agent(model=OpenAIResponses(...), output_schema=...)` for structured outputs
    - Use `Agent.run(...)` or `agent.print_response(...)` for text outputs

    This class writes uploaded image bytes to a temporary file and passes
    the file path to `Image(filepath=...)` as shown in the examples.
    """

    def __init__(self, model_id: str = "gemini-2.5-flash-lite"):
        self.model_id = model_id
        self.api_key=""

    async def parse_topology(self, image_bytes: bytes) -> Tuple[List[Node], List[Edge]]:
        """Use an Agno Agent to extract structured topology (nodes + edges) from an image.

        Returns lists of `Node` and `Edge`. Raises RuntimeError if Agno not available
        or the agent returns an unexpected format.
        """

        # Write bytes to a temp file for Agno Image(filepath=...)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tf:
            tf.write(image_bytes)
            temp_path = tf.name

        try:
            # Use Pydantic Topology model as Agno output_schema for strict parsing
            agent = Agent(model=Gemini(id=self.model_id,api_key=self.api_key), output_schema=Topology)

            prompt = topology_prompt_with_example()

            image = Image(filepath=temp_path)

            resp = agent.run(prompt, images=[image], stream=False)

            # Agent should return a Pydantic-compatible object; attempt to access `.content` or use resp directly
            result = None
            if hasattr(resp, "__iter__") and not isinstance(resp, Topology):
                for event in resp:
                    result = getattr(event, "content", None) or event
            else:
                result = getattr(resp, "content", None) or resp

            if isinstance(result, Topology):
                topo = result
            elif isinstance(result, dict):
                topo = Topology(**result)
            else:
                # Try to parse from string
                try:
                    topo = Topology(**json.loads(str(result)))
                except Exception as e:
                    raise RuntimeError(f"Could not parse topology from Agno response: {e}")

            return topo.nodes, topo.edges
        finally:
            try:
                os.unlink(temp_path)
            except Exception:
                pass

    async def generate_scenarios(self, image_bytes: bytes, topology: Topology) -> List[Scenario]:
        """Generate failure scenarios from a topology and architecture image using Agno Agent.

        The agent receives both the image and topology JSON for richer context.
        Returns a list of `Scenario` objects. Raises RuntimeError if Agno not available.
        """

        # Write image bytes to a temp file for Agno Image(filepath=...)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tf:
            tf.write(image_bytes)
            temp_path = tf.name

        try:
            # Use ScenariosOut model as Agno output_schema for strict parsing
            agent = Agent(model=Gemini(id=self.model_id,api_key=self.api_key), output_schema=ScenariosOut)

            prompt = scenarios_prompt_for_topology(topology)

            image = Image(filepath=temp_path)

            resp = agent.run(prompt, images=[image], stream=False)

            result = None
            if hasattr(resp, "__iter__") and not isinstance(resp, ScenariosOut):
                for event in resp:
                    result = getattr(event, "content", None) or event
            else:
                result = getattr(resp, "content", None) or resp

            if isinstance(result, ScenariosOut):
                return result.scenarios
            elif isinstance(result, dict):
                return ScenariosOut(**result).scenarios
            else:
                try:
                    return ScenariosOut(**json.loads(str(result))).scenarios
                except Exception as e:
                    raise RuntimeError(f"Could not parse scenarios from Agno response: {e}")
        finally:
            try:
                os.unlink(temp_path)
            except Exception:
                pass


llm_manager = LLMManager()
