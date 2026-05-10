export type NodeState =
  | "healthy"
  | "degraded"
  | "failing"
  | "down"
  | "recovering"

export type TopologyNode = {
  id: string
  type: string
  label: string
  tier: string
  lane?: string
  xHint?: number
}

export type TopologyEdge = {
  source: string
  target: string
  mode: "sync" | "async"
}

export type Scenario = {
  id: string
  title: string
  severity: "Low" | "Medium" | "High"
}