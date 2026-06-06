import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { getLayerColor } from "./LayerLegend";

export interface PortalNodeData extends Record<string, unknown> {
  targetLayerId: string;
  targetLayerName: string;
  layerColorIndex: number;
  onNavigate: (layerId: string) => void;
}

export type PortalFlowNode = Node<PortalNodeData, "portal">;

function PortalNode({
  data,
}: NodeProps<PortalFlowNode>) {
  const color = getLayerColor(data.layerColorIndex);

  return (
    <div
      className="relative rounded-2xl bg-white/60 overflow-hidden cursor-pointer transition-all duration-200 hover:bg-white/80"
      style={{
        width: 220,
        border: `2px dashed ${color.border}`,
        boxShadow: "0 12px 28px rgba(64, 47, 75, 0.08)",
      }}
      onClick={() => data.onNavigate(data.targetLayerId)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-accent-dim !border-white !w-2.5 !h-2.5"
      />

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color.label }}
            />
            <span className="text-sm text-text-primary truncate">
              {data.targetLayerName}
            </span>
          </div>
          <span className="text-text-muted ml-2 shrink-0">→</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-accent-dim !border-white !w-2.5 !h-2.5"
      />
    </div>
  );
}

export default memo(PortalNode);
