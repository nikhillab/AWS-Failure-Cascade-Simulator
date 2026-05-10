export type TickEvent = {
  type: "tick"
  tick: number

  nodes: {
    id: string
    state: string

    metrics: {
      latency?: number
      errors?: number
    }
  }[]
}

export type NarratorEvent = {
  type: "narrator"
  tick: number
  message: string
}

export type ResetEvent = {
  type: "reset"
  message: string
}

export type SimulationStartedEvent = {
  type: "simulation_started"
  scenario: string
}

export type SimulationCompletedEvent = {
  type: "simulation_completed"
  scenario: string
}

export type SocketEvent =
  | TickEvent
  | NarratorEvent
  | ResetEvent
  | SimulationStartedEvent
  | SimulationCompletedEvent