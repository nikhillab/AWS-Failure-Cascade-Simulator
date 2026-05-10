import { Handle, Position } from "reactflow"

const stateStyles: Record<string, string> = {
  healthy:
    "border-emerald-500/50 shadow-emerald-500/20 bg-emerald-950/20",

  degraded:
    "border-amber-500/50 shadow-amber-500/30 bg-amber-950/20",

  failing:
    "border-orange-500/50 shadow-orange-500/30 bg-orange-950/20",

  down:
    "border-red-500/50 shadow-red-500/40 bg-red-950/20",

  recovering:
    "border-cyan-500/50 shadow-cyan-500/30 bg-cyan-950/20",
}

export default function ServiceNode({
  data,
}: any) {
  return (
    <div
      className={`
        min-w-[240px]
        rounded-xl
        border-2
        bg-gradient-to-br
        from-slate-800
        to-slate-900
        px-5
        py-4
        shadow-2xl
        backdrop-blur-xl
        transition-all
        duration-300
        ${stateStyles[data.state]}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
      />

      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-white">
            {data.label}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {data.type}
          </div>
        </div>

        <div
          className={`
            rounded-full
            px-2.5
            py-1
            text-xs
            font-bold
            whitespace-nowrap
            ${
              data.state === "healthy"
                ? "bg-emerald-500/30 text-emerald-300"
                : ""
            }
            ${
              data.state === "degraded"
                ? "bg-amber-500/30 text-amber-300"
                : ""
            }
            ${
              data.state === "failing"
                ? "bg-orange-500/30 text-orange-300"
                : ""
            }
            ${
              data.state === "down"
                ? "bg-red-500/30 text-red-300"
                : ""
            }
            ${
              data.state === "recovering"
                ? "bg-cyan-500/30 text-cyan-300"
                : ""
            }
          `}
        >
          {data.state.charAt(0).toUpperCase() + data.state.slice(1)}
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-slate-400 font-mono">
        <div>
          LAT:{" "}
          <span className="text-slate-200">
            {data.latency || 0}ms
          </span>
        </div>

        <div>
          ERR:{" "}
          <span className="text-slate-200">
            {Math.round(
              (data.errors || 0) * 100
            )}
            %
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  )
}