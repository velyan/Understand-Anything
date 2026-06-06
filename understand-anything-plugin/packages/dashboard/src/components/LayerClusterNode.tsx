import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { getLayerColor } from "./LayerLegend";

export interface LayerClusterData extends Record<string, unknown> {
  layerId: string;
  layerName: string;
  layerDescription: string;
  layerColorIndex: number;
  searchMatchCount?: number;
  onDrillIn: (layerId: string) => void;
}

export type LayerClusterFlowNode = Node<LayerClusterData, "layer-cluster">;

function LayerClusterNode({
  data,
}: NodeProps<LayerClusterFlowNode>) {
  const color = getLayerColor(data.layerColorIndex);

  return (
    <div
      className="moya-node-card relative rounded-[20px] overflow-hidden cursor-pointer transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold/40 group"
      style={{
        width: 280,
      }}
      onClick={() => data.onDrillIn(data.layerId)}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[20px]"
        style={{ backgroundColor: color.label }}
      />

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-accent-dim !border-white !w-2.5 !h-2.5"
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-heading font-bold text-text-primary tracking-normal leading-tight">
              {data.layerName}
            </div>
            <div className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed mt-1.5">
              {data.layerDescription}
            </div>
          </div>
          <span className="h-8 w-8 rounded-full bg-white/70 border border-white/80 text-accent flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
        {data.searchMatchCount != null && data.searchMatchCount > 0 && (
          <div className="mt-3 inline-flex text-[10px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            Search match
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-accent-dim !border-white !w-2.5 !h-2.5"
      />
    </div>
  );
}

export default memo(LayerClusterNode);
