import { useSimulationStore } from "../../store/simulationStore"
import { ChevronDown } from "lucide-react"

export default function CascadeLog() {
  const logs = useSimulationStore((s) => s.logs)

  // Simple timestamp generator for demo
  const getTimestamp = (index: number) => {
    const offset = index * 3
    const minutes = Math.floor(offset / 60)
    const seconds = offset % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  // Get icon/color based on log content
  const getLogStyle = (log: string) => {
    if (log.includes('failing') || log.includes('down')) {
      return { icon: '🔴', color: 'text-red-400', bgColor: 'bg-red-500/10' }
    } else if (log.includes('degraded') || log.includes('Latency')) {
      return { icon: '🟡', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' }
    } else if (log.includes('recovering') || log.includes('healthy')) {
      return { icon: '🟢', color: 'text-green-400', bgColor: 'bg-green-500/10' }
    }
    return { icon: '🔵', color: 'text-blue-400', bgColor: 'bg-blue-500/10' }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 h-[280px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Cascade Log
        </h3>
        <button className="text-slate-400 hover:text-slate-300">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {logs.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            No logs yet. Start a simulation to see cascade events.
          </div>
        ) : (
          logs.map((log, index) => {
            const style = getLogStyle(log)
            return (
              <div
                key={index}
                className={`text-xs px-3 py-2 rounded flex gap-2 items-start ${style.bgColor}`}
              >
                <span className="text-slate-500 font-mono flex-shrink-0 w-12">
                  {getTimestamp(index)}
                </span>
                <span className={`font-mono flex-1 ${style.color}`}>
                  {log}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}