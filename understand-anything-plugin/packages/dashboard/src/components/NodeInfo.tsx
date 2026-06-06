import { useEffect, useState } from "react";
import { useDashboardStore } from "../store";
import { useI18n } from "../contexts/I18nContext";
import type { EdgeType, KnowledgeGraph, GraphNode } from "@understand-anything/core/types";

function getDirectionalLabel(edgeType: string, isSource: boolean, t: ReturnType<typeof useI18n>["t"]): string {
  const labels = t.edgeLabels[edgeType as EdgeType];
  if (!labels) {
    const formatted = edgeType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return isSource ? formatted : `${formatted} (reverse)`;
  }
  return isSource ? labels.forward : labels.backward;
}

function KnowledgeNodeDetails({ node, graph }: { node: GraphNode; graph: KnowledgeGraph }) {
  const navigateToNode = useDashboardStore((s) => s.navigateToNode);
  const { t } = useI18n();
  const meta = node.knowledgeMeta;

  // Wikilinks (outgoing related edges)
  const wikilinks = graph.edges
    .filter((e) => e.type === "related" && e.source === node.id)
    .map((e) => graph.nodes.find((n) => n.id === e.target))
    .filter((n): n is GraphNode => n !== undefined);

  // Backlinks (incoming related edges)
  const backlinks = graph.edges
    .filter((e) => e.type === "related" && e.target === node.id)
    .map((e) => graph.nodes.find((n) => n.id === e.source))
    .filter((n): n is GraphNode => n !== undefined);

  // Category
  const categoryEdge = graph.edges.find(
    (e) => e.type === "categorized_under" && e.source === node.id
  );
  const categoryNode = categoryEdge
    ? graph.nodes.find((n) => n.id === categoryEdge.target)
    : null;

  return (
    <div className="space-y-3">
      {categoryNode && (
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.category}</h4>
          <button
            type="button"
            onClick={() => navigateToNode(categoryNode.id)}
            className="text-[11px] px-2 py-0.5 rounded bg-elevated text-accent hover:text-accent-bright transition-colors"
          >
            {categoryNode.name}
          </button>
        </div>
      )}
      {meta?.wikilinks && meta.wikilinks.length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
            {t.nodeInfo.wikilinks} ({wikilinks.length})
          </h4>
          <div className="space-y-1 max-h-[200px] overflow-auto">
            {wikilinks.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => navigateToNode(n.id)}
                className="block w-full text-left px-2 py-1.5 rounded bg-elevated hover:bg-accent/10 text-[11px] text-text-secondary hover:text-accent transition-colors truncate"
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {backlinks.length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
            {t.nodeInfo.backlinks} ({backlinks.length})
          </h4>
          <div className="space-y-1 max-h-[200px] overflow-auto">
            {backlinks.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => navigateToNode(n.id)}
                className="block w-full text-left px-2 py-1.5 rounded bg-elevated hover:bg-accent/10 text-[11px] text-text-secondary hover:text-accent transition-colors truncate"
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {meta?.content && (
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.common.preview}</h4>
          <div className="text-[11px] text-text-secondary leading-relaxed bg-elevated rounded-lg p-3 max-h-[300px] overflow-auto whitespace-pre-wrap font-mono">
            {meta.content.slice(0, 1500)}
            {meta.content.length > 1500 && (
              <span className="text-text-muted">... {t.common.truncated}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DomainNodeDetails({ node, graph }: { node: GraphNode; graph: KnowledgeGraph }) {
  const navigateToDomain = useDashboardStore((s) => s.navigateToDomain);
  const selectNode = useDashboardStore((s) => s.selectNode);
  const { t } = useI18n();
  const meta = node.domainMeta;

  if (node.type === "domain") {
    const flows = graph.edges
      .filter((e) => e.type === "contains_flow" && e.source === node.id)
      .map((e) => graph.nodes.find((n) => n.id === e.target))
      .filter((n): n is GraphNode => n !== undefined);

    return (
      <div className="space-y-3">
        {Array.isArray(meta?.entities) && meta.entities.length > 0 ? (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.entities}</h4>
            <div className="flex flex-wrap gap-1">
              {meta.entities.map((e) => (
                <span key={e} className="text-[11px] px-2 py-0.5 rounded bg-elevated text-text-secondary">{e}</span>
              ))}
            </div>
          </div>
        ) : null}
        {Array.isArray(meta?.businessRules) && meta.businessRules.length > 0 ? (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.businessRules}</h4>
            <ul className="text-[11px] text-text-secondary space-y-1">
              {meta.businessRules.map((r, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-accent shrink-0">-</span>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {Array.isArray(meta?.crossDomainInteractions) && meta.crossDomainInteractions.length > 0 ? (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.crossDomain}</h4>
            <ul className="text-[11px] text-text-secondary space-y-1">
              {meta.crossDomainInteractions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {flows.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.flows}</h4>
            <div className="space-y-1">
              {flows.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { navigateToDomain(node.id); selectNode(f.id); }}
                  className="block w-full text-left px-2 py-1.5 rounded bg-elevated hover:bg-accent/10 text-[11px] text-text-secondary hover:text-accent transition-colors"
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (node.type === "flow") {
    const steps = graph.edges
      .filter((e) => e.type === "flow_step" && e.source === node.id)
      .sort((a, b) => a.weight - b.weight)
      .map((e) => graph.nodes.find((n) => n.id === e.target))
      .filter((n): n is GraphNode => n !== undefined);

    return (
      <div className="space-y-3">
        {meta?.entryPoint ? (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.entryPoint}</h4>
            <div className="text-[11px] font-mono text-accent">{meta.entryPoint}</div>
          </div>
        ) : null}
        {steps.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.steps}</h4>
            <ol className="space-y-1">
              {steps.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => selectNode(s.id)}
                    className="block w-full text-left px-2 py-1.5 rounded bg-elevated hover:bg-accent/10 text-[11px] transition-colors"
                  >
                    <span className="text-accent/60 mr-1.5">{i + 1}.</span>
                    <span className="text-text-secondary hover:text-accent">{s.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (node.type === "step") {
    if (!node.filePath) return null;
    return (
      <div className="space-y-3">
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t.nodeInfo.implementation}</h4>
          <div className="text-[11px] font-mono text-text-secondary">
            {node.filePath}
            {node.lineRange && <span className="text-text-muted">:{node.lineRange[0]}-{node.lineRange[1]}</span>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function NodeInfo() {
  const graph = useDashboardStore((s) => s.graph);
  const selectedNodeId = useDashboardStore((s) => s.selectedNodeId);
  const nodeHistory = useDashboardStore((s) => s.nodeHistory);
  const goBackNode = useDashboardStore((s) => s.goBackNode);
  const [languageExpanded, setLanguageExpanded] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { t } = useI18n();

  const navigateToNode = useDashboardStore((s) => s.navigateToNode);
  const navigateToHistoryIndex = useDashboardStore((s) => s.navigateToHistoryIndex);
  const selectNode = useDashboardStore((s) => s.selectNode);
  const openCodeViewer = useDashboardStore((s) => s.openCodeViewer);
  const viewMode = useDashboardStore((s) => s.viewMode);
  const domainGraph = useDashboardStore((s) => s.domainGraph);

  const activeGraph = viewMode === "domain" && domainGraph ? domainGraph : graph;
  const node = activeGraph?.nodes.find((n) => n.id === selectedNodeId) ?? null;

  useEffect(() => {
    setDetailsOpen(false);
    setLanguageExpanded(true);
  }, [selectedNodeId]);

  // Resolve history node names for the breadcrumb trail
  const historyNodes = nodeHistory.map((id) => {
    const n = activeGraph?.nodes.find((gn) => gn.id === id);
    return { id, name: n?.name ?? id };
  });

  if (!node) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-text-muted text-sm">{t.common.selectNode}</p>
      </div>
    );
  }

  const allEdges = activeGraph?.edges ?? [];
  const connections = allEdges.filter(
    (e) => e.source === node.id || e.target === node.id,
  );

  // Separate child nodes (contained IN this file) from other connections
  const childEdges = connections.filter(
    (e) => e.type === "contains" && e.source === node.id,
  );
  const otherConnections = connections.filter(
    (e) => !(e.type === "contains" && e.source === node.id),
  );

  // Resolve child nodes
  const childNodes = childEdges
    .map((e) => activeGraph?.nodes.find((n) => n.id === e.target))
    .filter((n): n is GraphNode => n !== undefined);
  const visibleChildNodes = childNodes.slice(0, 3);
  const visibleConnections = otherConnections.slice(0, 3);

  return (
    <div className="h-full w-full overflow-auto px-4 pb-5 animate-fade-slide-in">
      {/* Navigation history trail */}
      {historyNodes.length > 0 && (
        <div className="mb-3 flex items-center gap-1 flex-wrap text-[10px]">
          <button
            onClick={goBackNode}
            className="text-[10px] font-semibold text-gold hover:text-gold-bright transition-colors flex items-center gap-1"
          >
            <span>←</span>
            <span>{t.common.back}</span>
          </button>
          <span className="text-text-muted text-[10px]">│</span>
          {historyNodes.slice(-3).map((h, i, arr) => (
            <span key={`${h.id}-${i}`} className="flex items-center gap-1">
              <button
                onClick={() => {
                  const fullIdx = historyNodes.length - arr.length + i;
                  navigateToHistoryIndex(fullIdx);
                }}
                className="text-[10px] text-text-muted hover:text-gold transition-colors truncate max-w-[80px]"
                title={h.name}
              >
                {h.name}
              </button>
              {i < arr.length - 1 && (
                <span className="text-text-muted text-[10px]">›</span>
              )}
            </span>
          ))}
          <span className="text-text-muted text-[10px]">›</span>
          <span className="text-[10px] text-text-primary font-medium truncate max-w-[80px]">
            {node.name}
          </span>
        </div>
      )}

      <div className="moya-liquid-card p-1.5 mb-3">
        <div className="moya-liquid-core p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-accent mb-2">
                Selected part
              </div>
              <h2 className="text-xl font-heading font-bold text-text-primary tracking-normal leading-tight">{node.name}</h2>
            </div>
            <button
              onClick={() => selectNode(null)}
              className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full transition-colors shrink-0 text-text-muted border border-border-subtle bg-white/60 hover:text-gold hover:border-gold/30"
            >
              Overview
            </button>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {node.summary}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDetailsOpen((value) => !value)}
        className="w-full group rounded-full bg-white/58 border border-white/70 text-text-secondary hover:text-text-primary px-4 py-3 text-sm font-semibold active:scale-[0.99] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_26px_rgba(64,47,75,0.06)] mb-4"
      >
        <span>{detailsOpen ? "Hide details" : "Show details"}</span>
        <span className={`h-7 w-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${detailsOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {detailsOpen && (
        <>
          {node.filePath && (
            <div className="text-xs text-text-secondary mb-4 rounded-2xl border border-border-subtle bg-white/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-text-muted mb-1">Where it lives</div>
                  <div className="font-mono truncate" title={node.filePath}>
                    {node.filePath}
                    {node.lineRange && (
                      <span className="ml-2 text-text-muted">
                        L{node.lineRange[0]}-{node.lineRange[1]}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openCodeViewer(node.id)}
                  className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border border-accent/20 text-accent hover:text-accent-bright hover:border-accent/45 transition-colors"
                >
                  Code
                </button>
              </div>
            </div>
          )}

          {node.languageNotes && (
            <div className="mb-4">
              <button
                onClick={() => setLanguageExpanded(!languageExpanded)}
                className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wide mb-2 hover:text-accent-bright transition-colors"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${languageExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t.nodeInfo.languageConcepts}
              </button>
              {languageExpanded && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-3">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {node.languageNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeGraph && node && (node.type === "article" || node.type === "entity" || node.type === "topic" || node.type === "claim" || node.type === "source") && (
            <KnowledgeNodeDetails node={node} graph={activeGraph} />
          )}

          {activeGraph && node && (node.type === "domain" || node.type === "flow" || node.type === "step") && (
            <DomainNodeDetails node={node} graph={activeGraph} />
          )}

          {visibleChildNodes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[11px] font-semibold text-gold uppercase tracking-wide mb-2">
                Parts inside this file
              </h3>
              <div className="space-y-1">
                {visibleChildNodes.map((child) => {
                  if (!child) return null;
                  return (
                    <div
                      key={child.id}
                      className="text-xs bg-white/60 rounded-2xl px-3 py-2 border border-border-subtle cursor-pointer hover:border-gold/40 hover:bg-gold/10 transition-colors"
                      onClick={() => navigateToNode(child.id)}
                    >
                      <div className="text-text-primary truncate">{child.name}</div>
                      {child.summary && (
                        <p className="text-[11px] text-text-muted mt-1 line-clamp-1">
                          {child.summary}
                        </p>
                      )}
                    </div>
                  );
                })}
                {childNodes.length > visibleChildNodes.length && (
                  <div className="text-[11px] text-text-muted px-3 py-1">
                    +{childNodes.length - visibleChildNodes.length} more inside
                  </div>
                )}
              </div>
            </div>
          )}

          {visibleConnections.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold text-gold uppercase tracking-wide mb-2">
                Related parts
              </h3>
              <div className="space-y-1.5">
                {visibleConnections.map((edge, i) => {
                  const isSource = edge.source === node.id;
                  const otherId = isSource ? edge.target : edge.source;
                  const otherNode = activeGraph?.nodes.find((n) => n.id === otherId);
                  const dirLabel = getDirectionalLabel(edge.type, isSource, t);

                  return (
                    <div
                      key={i}
                      className="text-xs bg-white/60 rounded-2xl px-3 py-2 border border-border-subtle flex items-center gap-2 cursor-pointer hover:border-gold/40 hover:bg-gold/10 transition-colors"
                      onClick={() => {
                        navigateToNode(otherId);
                      }}
                    >
                      <span className="text-text-muted min-w-[72px] truncate">{dirLabel}</span>
                      <span className="text-text-primary truncate">
                        {otherNode?.name ?? otherId}
                      </span>
                    </div>
                  );
                })}
                {otherConnections.length > visibleConnections.length && (
                  <div className="text-[11px] text-text-muted px-3 py-1">
                    +{otherConnections.length - visibleConnections.length} more related parts
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
