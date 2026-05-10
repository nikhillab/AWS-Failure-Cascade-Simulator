import { ReactNode } from "react"
import { useSimulationStore } from "../../store/simulationStore"

type Props = {
  children: ReactNode
}

export default function Sidebar({ children }: Props) {
  const nodes = useSimulationStore((s) => s.nodes)
  const connected = useSimulationStore((s) => s.connected)

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pb-4">
      {/* Sections */}
      <div className="space-y-4 flex-1">
        {children}
      </div>

      {/* Simulation Info - appears at bottom */}
      {nodes.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-auto">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Simulation Info
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Simulation ID</span>
              <span className="text-slate-200 font-mono">SIM-1234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className={connected ? 'text-green-400' : 'text-slate-400'}>
                  {connected ? 'Running' : 'Idle'}
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scenario</span>
              <span className="text-slate-200">Aurora Latency Spike</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Started At</span>
              <span className="text-slate-200 font-mono text-xs">May 13, 2025 11:23:11 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Time</span>
              <span className="text-slate-200 font-mono">00:00:18 / 00:01:00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
