import { useEffect, useState } from "react"

import Header from "./components/layout/Header"
import Sidebar from "./components/layout/Sidebar"
import Controls from "./components/layout/Controls"
import UploadPanel from "./components/upload/UploadPanel"

import TopologyCanvas from "./components/topology/TopologyCanvas"

import ScenarioPanel from "./components/panels/ScenarioPanel"

import NarratorPanel from "./components/panels/NarratorPanel"

import CascadeLog from "./components/panels/CascadeLog"

import {
  connectWebSocket,
} from "./api/simulationApi"

import { useSimulationStore } from "./store/simulationStore"

import type { SocketEvent } from "./types/events"

export default function App() {
  const [simulationId, setSimulationId] =
    useState<string | null>(null)

  const updateNode =
    useSimulationStore((s) => s.updateNode)

  const setNarrator =
    useSimulationStore((s) => s.setNarrator)

  const addLog =
    useSimulationStore((s) => s.addLog)

  const reset =
    useSimulationStore((s) => s.reset)

  const setSimulationIdStore = useSimulationStore((s) => s.setSimulationId)

  useEffect(() => {
    setSimulationIdStore(simulationId)
  }, [simulationId, setSimulationIdStore])

  useEffect(() => {
    if (!simulationId) return

    const ws = connectWebSocket(
      simulationId,
      (data: SocketEvent) => {
        switch (data.type) {
          case "tick":
            data.nodes.forEach((node) => {
              updateNode({
                id: node.id,
                state: node.state as any,
                latency: node.metrics?.latency,
                errors: node.metrics?.errors,
              })

              addLog(
                `${node.id} → ${node.state}`
              )
            })

            break

          case "narrator":
            setNarrator(data.message)
            break

          case "reset":
            reset()
            break

          case "simulation_started":
            addLog(
              `Simulation started: ${data.scenario}`
            )
            break

          case "simulation_completed":
            addLog(
              `Simulation completed: ${data.scenario}`
            )
            break
        }
      }
    )

    return () => {
      ws.close()
    }
  }, [simulationId, updateNode, setNarrator, addLog, reset])

  return (
    <div className="h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
      <Header />
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[280px_1fr_320px] gap-4 h-full p-4">
          {/* Left Sidebar */}
          <Sidebar>
            <UploadPanel onUploaded={setSimulationId} />
            
            {simulationId && (
              <>
                <ScenarioPanel simulationId={simulationId} />
              </>
            )}
          </Sidebar>

          {/* Center - Topology and Controls */}
          <div className="flex flex-col gap-4 min-h-0">
            <TopologyCanvas />
            <Controls simulationId={simulationId} />
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
            <NarratorPanel />
            <CascadeLog />
          </div>
        </div>
      </div>
    </div>
  )
}