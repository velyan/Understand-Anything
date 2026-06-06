import { useMemo, useState } from "react";
import { useDashboardStore } from "../store";
import { useI18n } from "../contexts/I18nContext";

export default function ProjectOverview() {
  const graph = useDashboardStore((s) => s.graph);
  const startTour = useDashboardStore((s) => s.startTour);
  const drillIntoLayer = useDashboardStore((s) => s.drillIntoLayer);
  const { t } = useI18n();
  const [areasOpen, setAreasOpen] = useState(false);

  const mainAreas = useMemo(() => graph?.layers.slice(0, 5) ?? [], [graph?.layers]);

  if (!graph) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-text-muted text-sm">{t.common.loading}</p>
      </div>
    );
  }

  const hasTour = graph.tour.length > 0;

  return (
    <div className="h-full w-full overflow-auto px-4 pb-5 pt-4 animate-fade-slide-in">
      <section className="moya-liquid-card p-1.5">
        <div className="moya-liquid-core p-6">
          <div className="inline-flex items-center rounded-full bg-white/55 border border-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            First look
          </div>

          <h2 className="font-heading text-[28px] leading-[1.06] font-bold text-text-primary tracking-normal mt-5">
            See the shape first.
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed mt-4">
            Let the project come into focus before the details arrive. Stay with
            the overview, or open any part when you are ready for the story underneath.
          </p>

          <div className="mt-6 space-y-2.5">
            {hasTour && (
              <button
                type="button"
                onClick={startTour}
                className="w-full group bg-accent text-white text-sm font-semibold py-3 pl-4 pr-2 rounded-full active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-between shadow-[0_18px_36px_rgba(198,111,146,0.22)]"
              >
                <span>Guide me through</span>
                <span className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-px">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAreasOpen((value) => !value)}
              className="w-full group rounded-full bg-white/58 border border-white/70 text-text-secondary hover:text-text-primary px-4 py-3 text-sm font-semibold active:scale-[0.99] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_26px_rgba(64,47,75,0.06)]"
            >
              <span>{areasOpen ? "Return to overview" : "Show me more"}</span>
              <span className={`h-7 w-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${areasOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {areasOpen && mainAreas.length > 0 && (
        <section className="mt-3 space-y-2 animate-fade-slide-in">
          {mainAreas.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => drillIntoLayer(layer.id)}
              className="w-full moya-liquid-list-item text-left group"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-text-primary truncate">
                  {layer.name}
                </span>
                {layer.description && (
                  <span className="block text-xs text-text-muted leading-relaxed mt-1 line-clamp-2">
                    {layer.description}
                  </span>
                )}
              </span>
              <span className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
