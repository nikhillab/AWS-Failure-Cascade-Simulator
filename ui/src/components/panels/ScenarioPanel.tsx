import { startSimulation } from "../../api/simulationApi"
import { useSimulationStore } from "../../store/simulationStore"
import { AlertCircle } from "lucide-react"

type Props = {
  simulationId: string
}

const severityColors = {
  Low: "bg-green-500/20 border-green-500/30 text-green-400",
  Medium: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
  High: "bg-red-500/20 border-red-500/30 text-red-400",
}

export default function ScenarioPanel({ simulationId }: Props) {
  const scenarios = useSimulationStore((s) => s.scenarios)
  const reset = useSimulationStore((s) => s.reset)

  async function handleRun(scenarioId: string) {
    // Reset state (clears logs, runtime, etc.) before starting new scenario
    reset()
    
    await startSimulation(simulationId, scenarioId)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
        Scenarios
      </h3>

      <div className="space-y-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleRun(scenario.id)}
            className="w-full text-left p-3 rounded-lg bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 hover:border-slate-500 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200">{scenario.title}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Trigger: {scenario.title.split(' ')[0]}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${severityColors[scenario.severity as keyof typeof severityColors]}`}>
                {scenario.severity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}