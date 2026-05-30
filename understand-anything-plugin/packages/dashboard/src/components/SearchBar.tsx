import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDashboardStore } from "../store";

const typeBadgeColors: Record<string, string> = {
  file: "text-node-file border border-node-file/30 bg-node-file/10",
  function: "text-node-function border border-node-function/30 bg-node-function/10",
  class: "text-node-class border border-node-class/30 bg-node-class/10",
  module: "text-node-module border border-node-module/30 bg-node-module/10",
  concept: "text-node-concept border border-node-concept/30 bg-node-concept/10",
  config: "text-node-config border border-node-config/30 bg-node-config/10",
  document: "text-node-document border border-node-document/30 bg-node-document/10",
  service: "text-node-service border border-node-service/30 bg-node-service/10",
  table: "text-node-table border border-node-table/30 bg-node-table/10",
  endpoint: "text-node-endpoint border border-node-endpoint/30 bg-node-endpoint/10",
  pipeline: "text-node-pipeline border border-node-pipeline/30 bg-node-pipeline/10",
  schema: "text-node-schema border border-node-schema/30 bg-node-schema/10",
  resource: "text-node-resource border border-node-resource/30 bg-node-resource/10",
  domain: "text-node-concept border border-node-concept/30 bg-node-concept/10",
  flow: "text-node-pipeline border border-node-pipeline/30 bg-node-pipeline/10",
  step: "text-node-function border border-node-function/30 bg-node-function/10",
};

export default function SearchBar() {
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const searchResults = useDashboardStore((s) => s.searchResults);
  const graph = useDashboardStore((s) => s.graph);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
  const navigateToNodeInLayer = useDashboardStore((s) => s.navigateToNodeInLayer);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build a lookup map for node details
  const nodeMap = useMemo(
    () => new Map((graph?.nodes ?? []).map((n) => [n.id, n])),
    [graph],
  );

  const topResults = searchResults.slice(0, 5);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setDropdownOpen(true);
    },
    [setSearchQuery],
  );

  const handleResultClick = useCallback(
    (nodeId: string) => {
      navigateToNodeInLayer(nodeId);
      setDropdownOpen(false);
    },
    [navigateToNodeInLayer],
  );

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = dropdownOpen && searchQuery.trim() && topResults.length > 0;

  return (
    <div ref={containerRef} className="relative z-30 pt-3">
      <div className="moya-app-chrome flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[22px]">
        <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setDropdownOpen(true)}
          placeholder="What are you curious about?"
          data-testid="search-input"
          className="flex-1 min-w-0 bg-white/70 text-text-primary text-sm rounded-full px-4 py-2.5 border border-border-subtle focus:outline-none focus:border-accent/50 focus:bg-white placeholder-text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        />
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute left-4 right-4 top-full mt-2 glass-heavy rounded-2xl shadow-[0_18px_44px_rgba(64,47,75,0.12)] overflow-hidden">
          {topResults.map((result) => {
            const node = nodeMap.get(result.nodeId);
            if (!node) return null;

            const badgeColor = typeBadgeColors[node.type] ?? typeBadgeColors.file;

            return (
              <button
                key={result.nodeId}
                type="button"
                onClick={() => handleResultClick(result.nodeId)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-accent/10 transition-colors text-left"
              >
                {/* Type badge */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeColor} shrink-0`}
                >
                  {node.type}
                </span>

                {/* Node name */}
                <span className="text-sm text-text-primary truncate flex-1">
                  {node.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
