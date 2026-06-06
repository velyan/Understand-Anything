import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { useDashboardStore } from "../store";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  summary: string;
  entryPoint?: string;
  entryType?: string;
  flowId: string;
}

export type FlowFlowNode = Node<FlowNodeData, "flow-node">;

function FlowNode({ data }: NodeProps<FlowFlowNode>) {
  const selectNode = useDashboardStore((s) => s.selectNode);
  const selectedNodeId = useDashboardStore((s) => s.selectedNodeId);
  const isSelected = selectedNodeId === data.flowId;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 min-w-[240px] max-w-[320px] cursor-pointer transition-all shadow-[0_12px_28px_rgba(64,47,75,0.08)] ${
        isSelected
          ? "border-accent bg-accent/10"
          : "border-border-medium bg-white/75 hover:border-accent/50"
      }`}
      onClick={() => selectNode(data.flowId)}
    >
      <Handle type="target" position={Position.Left} className="!bg-accent/60 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-accent/60 !w-2 !h-2" />

      <div className="text-xs font-semibold text-text-primary mb-1 truncate">
        {data.label}
      </div>
      <div className="text-[10px] text-text-secondary line-clamp-2">
        {data.summary}
      </div>
    </div>
  );
}

export default memo(FlowNode);
