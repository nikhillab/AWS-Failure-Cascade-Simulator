import { useState } from "react"
import { Play, Pause, RotateCcw, Grid2X2, List, Volume2 } from "lucide-react"
import { useSimulationStore } from "../../store/simulationStore"
import {
  resetSimulation,
  pauseSimulation,
  resumeSimulation,
  stepSimulation,
} from "../../api/simulationApi"

type Props = {
  simulationId?: string | null
}

export default function Controls({ simulationId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeProgress, setTimeProgress] = useState(18)
  const [loading, setLoading] = useState(false)
  
  const nodes = useSimulationStore((s) => s.nodes)
  const runtime = useSimulationStore((s) => s.runtime)
  const reset = useSimulationStore((s) => s.reset)

  const handlePlayPause = async () => {
    if (!simulationId) return

    setLoading(true)
    try {
      if (isPlaying) {
        await pauseSimulation(simulationId)
        setIsPlaying(false)
      } else {
        await resumeSimulation(simulationId)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Play/Pause failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStep = async () => {
    if (!simulationId) return

    setLoading(true)
    try {
      await stepSimulation(simulationId)
    } catch (error) {
      console.error("Step failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!simulationId) return

    setLoading(true)
    try {
      await resetSimulation(simulationId)
      reset()
      setIsPlaying(false)
      setTimeProgress(0)
    } catch (error) {
      console.error("Reset failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalTime = 60
  const currentSeconds = Math.floor(timeProgress)
  const remainingSeconds = totalTime - currentSeconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Count metrics from nodes
  const degradedCount = Object.values(runtime).filter(
    (n) => n.state === "degraded"
  ).length
  const failingCount = Object.values(runtime).filter(
    (n) => n.state === "failing"
  ).length

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-4">
      {/* Simulation Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SIMULATION CONTROLS</span>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handlePlayPause}
            disabled={loading || !simulationId}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleStep}
            disabled={loading || !simulationId}
            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            Step
          </button>
          <button
            onClick={handleReset}
            disabled={loading || !simulationId}
            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TIMELINE</span>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={totalTime}
            value={timeProgress}
            onChange={(e) => setTimeProgress(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span className="font-mono">{formatTime(currentSeconds)}</span>
            <span className="font-mono">{formatTime(totalTime)}</span>
          </div>
        </div>
      </div>

      {/* Legend & Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LEGEND & METRICS</span>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-400" />
              <span className="text-slate-300">Sync</span>
              <div className="w-3 h-0.5 border-t-2 border-dashed border-blue-400 ml-auto" />
              <span className="text-slate-300">Async</span>
            </div>
            <div className="flex gap-2 text-slate-300">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs">Healthy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs">Degraded</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs">Failing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs">Down</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-slate-200">{nodes.length || 0}</div>
            <div className="text-xs text-slate-400">Components</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-slate-200">9</div>
            <div className="text-xs text-slate-400">Connections</div>
          </div>
          <div className="bg-yellow-500/20 rounded-lg p-2 text-center border border-yellow-500/30">
            <div className="text-lg font-bold text-yellow-400">{degradedCount}</div>
            <div className="text-xs text-yellow-300">Degraded</div>
          </div>
          <div className="bg-red-500/20 rounded-lg p-2 text-center border border-red-500/30">
            <div className="text-lg font-bold text-red-400">{failingCount}</div>
            <div className="text-xs text-red-300">Failing</div>
          </div>
        </div>
      </div>
    </div>
  )
}
