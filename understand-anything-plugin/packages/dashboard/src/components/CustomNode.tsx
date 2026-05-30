import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import type { NodeType } from "@understand-anything/core/types";
import { useI18n } from "../contexts/I18nContext";

// Color maps keyed by NodeType — must be kept in sync with core NodeType union.
const typeColors: Record<NodeType, string> = {
  file: "var(--color-node-file)",
  function: "var(--color-node-function)",
  class: "var(--color-node-class)",
  module: "var(--color-node-module)",
  concept: "var(--color-node-concept)",
  config: "var(--color-node-config)",
  document: "var(--color-node-document)",
  service: "var(--color-node-service)",
  table: "var(--color-node-table)",
  endpoint: "var(--color-node-endpoint)",
  pipeline: "var(--color-node-pipeline)",
  schema: "var(--color-node-schema)",
  resource: "var(--color-node-resource)",
  domain: "var(--color-node-concept)",
  flow: "var(--color-node-pipeline)",
  step: "var(--color-node-function)",
  article: "var(--color-node-article)",
  entity: "var(--color-node-entity)",
  topic: "var(--color-node-topic)",
  claim: "var(--color-node-claim)",
  source: "var(--color-node-source)",
};

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  nodeType: string;
  summary: string;
  complexity: string;
  isHighlighted: boolean;
  searchScore?: number;
  isSelected: boolean;
  isTourHighlighted: boolean;
  isDiffChanged: boolean;
  isDiffAffected: boolean;
  isDiffFaded: boolean;
  isNeighbor: boolean;
  isSelectionFaded: boolean;
  onNodeClick?: (nodeId: string) => void;
  incomingCount?: number;
  outgoingCount?: number;
  tags?: string[];
}

export type CustomFlowNode = Node<CustomNodeData, "custom">;

function CustomNodeComponent({
  id,
  data,
}: NodeProps<CustomFlowNode>) {
  const knownType = data.nodeType as NodeType;
  const barColor = typeColors[knownType] ?? typeColors.file;
  const { t } = useI18n();

  if (import.meta.env.DEV && !(knownType in typeColors)) {
    console.warn(`[CustomNode] Unknown node type "${data.nodeType}" — using "file" colors`);
  }

  let extraClass = "";
  if (data.isSelected) {
    extraClass = "ring-2 ring-accent node-glow";
  } else if (data.isTourHighlighted) {
    extraClass = "ring-2 ring-accent-dim animate-accent-pulse";
  } else if (data.isHighlighted) {
    const score = data.searchScore ?? 1;
    if (score <= 0.1) {
      extraClass = "ring-2 ring-accent-bright";
    } else if (score <= 0.3) {
      extraClass = "ring-2 ring-accent";
    } else {
      extraClass = "ring-1 ring-accent-dim/60";
    }
  }

  // Diff overlay styling (composes with above)
  if (data.isDiffChanged) {
    extraClass += " ring-2 ring-[var(--color-diff-changed)] diff-changed-glow";
  } else if (data.isDiffAffected) {
    extraClass += " ring-1 ring-[var(--color-diff-affected)] diff-affected-glow";
  } else if (data.isDiffFaded) {
    extraClass += " diff-faded";
  }

  // Selection-based dimming (when another node is selected, fade unrelated nodes)
  if (data.isSelectionFaded) {
    extraClass += " opacity-20 pointer-events-auto";
  } else if (data.isNeighbor) {
    extraClass += " ring-1 ring-gold-dim/50";
  }

  const name = data.label ?? "unnamed";
  const truncatedName =
    name.length > 24 ? name.slice(0, 22) + "..." : name;

  return (
    <div
      className={`moya-node-card relative rounded-[20px] ${extraClass} min-w-[190px] max-w-[230px] overflow-hidden transition-[box-shadow,outline,opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer group`}
      onClick={() => data.onNodeClick?.(id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-accent-dim !border-white !w-2.5 !h-2.5"
      />

      <div className="relative px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0 shadow-[0_0_0_4px_rgba(255,255,255,0.75)]"
              style={{ backgroundColor: barColor }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              Part
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            {data.tags?.includes("tested") && (
              <span
                className="inline-block w-2 h-2 rounded-full bg-node-function shadow-[0_0_7px_rgba(95,150,127,0.46)]"
                role="img"
                aria-label={t.customNode.tested}
                title={t.customNode.hasTests}
              />
            )}
            <span className="h-6 w-6 rounded-full bg-white/70 border border-white/80 text-accent flex items-center justify-center opacity-70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:opacity-100">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        <div className="text-sm font-heading font-bold text-text-primary truncate tracking-normal" title={data.label}>
          {truncatedName}
        </div>

        <div className="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
          {data.summary}
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

const CustomNode = memo(CustomNodeComponent);
export default CustomNode;
