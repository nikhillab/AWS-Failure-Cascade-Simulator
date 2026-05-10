import { create } from "zustand"

import type {
    NodeState,
    Scenario,
    TopologyEdge,
    TopologyNode,
} from "../types/simulation"

type RuntimeNode = {
  id: string
  state: NodeState
  latency?: number
  errors?: number
}

type Store = {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
  scenarios: Scenario[]

  runtime: Record<string, RuntimeNode>

  logs: string[]

  narrator: string

  connected: boolean

  simulationId: string | null

  isRunning: boolean

  reset: () => void

  clearLogs: () => void

  setConnected: (value: boolean) => void

  setSimulationId: (id: string | null) => void

  setIsRunning: (running: boolean) => void

  setTopology: (
    nodes: TopologyNode[],
    edges: TopologyEdge[]
  ) => void

  setScenarios: (scenarios: Scenario[]) => void

  updateNode: (node: RuntimeNode) => void

  addLog: (log: string) => void

  setNarrator: (text: string) => void
}

export const useSimulationStore = create<Store>((set) => ({
  nodes: [],
  edges: [],

  scenarios: [],

  runtime: {},

  logs: [],

  narrator: "Waiting for simulation...",

  connected: false,

  simulationId: null,

  isRunning: false,

  reset: () =>
    set({
      runtime: {},
      logs: [],
      narrator: "Simulation reset.",
      isRunning: false,
    }),

  clearLogs: () =>
    set({
      logs: [],
    }),

  setConnected: (value) =>
    set({
      connected: value,
    }),

  setSimulationId: (id) =>
    set({
      simulationId: id,
    }),

  setIsRunning: (running) =>
    set({
      isRunning: running,
    }),

  setTopology: (nodes, edges) =>
    set({
      nodes,
      edges,
    }),

  setScenarios: (scenarios) =>
    set({
      scenarios,
    }),

  updateNode: (node) =>
    set((state) => ({
      runtime: {
        ...state.runtime,
        [node.id]: node,
      },
    })),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),

  setNarrator: (text) =>
    set({
      narrator: text,
    }),
}))