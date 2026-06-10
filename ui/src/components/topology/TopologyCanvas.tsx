import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow"
import { useState } from "react"

import NodeDetailsPanel from "./NodeDetailsPanel"

import "reactflow/dist/style.css"

import { useSimulationStore } from "../../store/simulationStore"

import ServiceNode from "./ServiceNode"

const nodeTypes = {
  serviceNode: ServiceNode,
}

const tierOrder: Record<string, number> = {
  edge: 0,
  ingress: 1,
  compute: 2,
  async: 3,
  data: 4,
  external: 5,
}


export default function TopologyCanvas() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const topologyNodes = useSimulationStore(
    (s) => s.nodes
  )

  const topologyEdges = useSimulationStore(
    (s) => s.edges
  )

  const runtime = useSimulationStore(
    (s) => s.runtime
  )

  const grouped = topologyNodes.reduce(
    (acc, node) => {
      if (!acc[node.tier]) {
        acc[node.tier] = []
      }

      acc[node.tier].push(node)

      return acc
    },
    {} as Record<string, typeof topologyNodes>
  )

  const nodes: Node[] = []

  Object.entries(grouped).forEach(
    ([tier, tierNodes]) => {
      const row = tierOrder[tier]

      tierNodes.sort(
        (a, b) =>
          (a.xHint || 0) - (b.xHint || 0)
      )

      tierNodes.forEach((node, index) => {
        nodes.push({
          id: node.id,

          type: "serviceNode",

          position: {
            x: 220 + index * 340,
            y: 100 + row * 220,
          },

          data: {
            ...node,
            state:
              runtime[node.id]?.state ||
              "healthy",

            latency:
              runtime[node.id]?.latency,

            errors:
              runtime[node.id]?.errors,
          },
        })
      })
    }
  )

  const edges: Edge[] = topologyEdges.map(
    (edge, index) => ({
      id: `edge-${index}`,

      source: edge.source,

      target: edge.target,

      animated: edge.mode === "async",

      style: {
        stroke:
          edge.mode === "async"
            ? "#f59e0b"
            : "#71717a",

        strokeWidth: 2,

        strokeDasharray:
          edge.mode === "async"
            ? "6 4"
            : undefined,
      },
    })
  )

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900">

      {/* REACT FLOW */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
      >
        <Background
          gap={24}
          size={1}
          color="#475569"
        />

        <Controls />

        <MiniMap
          style={{
            backgroundColor: "#1e293b",
          }}
        />
      </ReactFlow>

      {/* Node details side panel */}
      <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  )
}