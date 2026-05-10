import { useSimulationStore } from "../../store/simulationStore"
import { Volume2 } from "lucide-react"

export default function NarratorPanel() {
  const narrator = useSimulationStore((s) => s.narrator)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 h-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          AI Narrator
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-400 font-semibold">LIVE</span>
          <Volume2 className="w-4 h-4 text-red-400" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {narrator}
        </p>
      </div>

      {/* Audio visualization */}
      <div className="mt-3 flex items-center gap-1 h-8 bg-slate-900/50 rounded-lg px-3 py-2">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-purple-500 rounded-full animate-pulse"
            style={{
              height: `${Math.random() * 100}%`,
              minHeight: '2px',
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}