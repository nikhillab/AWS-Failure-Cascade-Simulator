import React from "react"
import { X, Info } from "lucide-react"

type Props = {
  node: any | null
  onClose: () => void
}

export default function NodeDetailsPanel({ node, onClose }: Props) {
  if (!node) return null

  const data = node.data || {}

  return (
    <div className="absolute top-6 right-6 z-50 w-96 h-[calc(100%-48px)]">
      <div className="h-full bg-slate-900/95 border border-slate-700 rounded-lg p-4 shadow-2xl backdrop-blur-md flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{data.label}</div>
              <div className="text-xs text-slate-400">{data.type}</div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="mb-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">State</div>
            <div className="inline-block px-3 py-1 rounded-full font-semibold text-xs bg-slate-800 border border-slate-700">
              {data.state}
            </div>
          </div>

          <div className="mb-4 text-sm text-slate-300">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Latency</span>
              <span className="font-mono">{data.latency ?? "-"} ms</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Errors</span>
              <span className="font-mono">{Math.round((data.errors ?? 0) * 100)}%</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Tier</span>
              <span className="font-mono">{data.tier ?? "-"}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Lane</span>
              <span className="font-mono">{data.lane ?? "-"}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Details</div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {data.description ?? "No additional details available."}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">Inspect</button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm">Actions</button>
        </div>
      </div>
    </div>
  )
}
