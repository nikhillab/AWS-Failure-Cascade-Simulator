const API_BASE = "http://127.0.0.1:8000"

export async function uploadDiagram(file: File) {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

export async function startSimulation(
  simulationId: string,
  scenarioId: string
) {
  const response = await fetch(
    `${API_BASE}/api/simulations/${simulationId}/start`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        scenarioId,
      }),
    }
  )

  return response.json()
}

export async function resetSimulation(
  simulationId: string
) {
  const response = await fetch(
    `${API_BASE}/api/simulations/${simulationId}/reset`,
    {
      method: "POST",
    }
  )

  return response.json()
}

export async function pauseSimulation(
  simulationId: string
) {
  const response = await fetch(
    `${API_BASE}/api/simulations/${simulationId}/pause`,
    {
      method: "POST",
    }
  )

  return response.json()
}

export async function resumeSimulation(
  simulationId: string
) {
  const response = await fetch(
    `${API_BASE}/api/simulations/${simulationId}/resume`,
    {
      method: "POST",
    }
  )

  return response.json()
}

export async function stepSimulation(
  simulationId: string
) {
  const response = await fetch(
    `${API_BASE}/api/simulations/${simulationId}/step`,
    {
      method: "POST",
    }
  )

  return response.json()
}

export function connectWebSocket(
  simulationId: string,
  onMessage: (data: any) => void
) {
  const ws = new WebSocket(
    `ws://127.0.0.1:8000/ws/simulations/${simulationId}`
  )

  ws.onopen = () => {
    console.log("WebSocket connected")

    setInterval(() => {
      ws.send("ping")
    }, 30000)
  }

  ws.onmessage = (event) => {
    onMessage(JSON.parse(event.data))
  }

  ws.onerror = (err) => {
    console.error(err)
  }

  return ws
}