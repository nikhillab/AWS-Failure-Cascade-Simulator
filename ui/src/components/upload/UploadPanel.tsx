import { useState } from "react"
import { Cloud, CheckCircle } from "lucide-react"
import { uploadDiagram } from "../../api/simulationApi"
import { useSimulationStore } from "../../store/simulationStore"

type Props = {
  onUploaded: (simulationId: string) => void
}

export default function UploadPanel({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const setTopology = useSimulationStore((s) => s.setTopology)
  const setScenarios = useSimulationStore((s) => s.setScenarios)

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    setLoading(true)

    const data = await uploadDiagram(file)

    setTopology(data.topology.nodes, data.topology.edges)
    setScenarios(data.scenarios)
    setUploaded(true)

    onUploaded(data.simulationId)

    setLoading(false)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
        Upload Diagram
      </h3>
      
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-lg p-8 cursor-pointer transition group">
        <Cloud className="w-8 h-8 text-slate-400 group-hover:text-slate-300 mb-2" />
        <span className="text-sm text-slate-300 text-center font-medium">
          Drag & drop your architecture diagram
        </span>
        <span className="text-xs text-slate-500 mt-1">
          PNG, JPG up to 10MB
        </span>
        
        <input 
          type="file" 
          onChange={handleUpload} 
          className="hidden"
          accept="image/*"
        />
      </label>

      {loading && (
        <p className="text-sm text-slate-400 mt-3 text-center">Parsing diagram...</p>
      )}

      {uploaded && !loading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Diagram loaded successfully</span>
        </div>
      )}

      <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
        Choose File
      </button>
    </div>
  )
}