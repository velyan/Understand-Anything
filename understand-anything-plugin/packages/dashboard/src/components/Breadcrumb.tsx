import { useDashboardStore } from "../store";
import { useI18n } from "../contexts/I18nContext";

export default function Breadcrumb() {
  const navigationLevel = useDashboardStore((s) => s.navigationLevel);
  const activeLayerId = useDashboardStore((s) => s.activeLayerId);
  const graph = useDashboardStore((s) => s.graph);
  const navigateToOverview = useDashboardStore((s) => s.navigateToOverview);
  const { t } = useI18n();

  const activeLayer = graph?.layers.find((l) => l.id === activeLayerId);

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
      {navigationLevel === "overview" && (
        <div className="px-4 py-2 rounded-full bg-white/80 border border-border-subtle text-xs font-semibold tracking-wide uppercase text-text-secondary shadow-[0_12px_28px_rgba(64,47,75,0.08)]">
          {t.breadcrumb.projectOverview}
        </div>
      )}

      {navigationLevel === "layer-detail" && (
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-gold/30 text-xs font-semibold tracking-wide uppercase shadow-[0_12px_28px_rgba(64,47,75,0.08)]">
          <button
            onClick={navigateToOverview}
            className="text-gold hover:text-gold-bright transition-colors"
          >
            {t.breadcrumb.project}
          </button>
          <span className="text-text-muted">›</span>
          <span className="text-text-primary">
            {activeLayer?.name ?? t.layer.defaultName}
          </span>
          <span className="text-text-muted ml-1 text-[10px] normal-case tracking-normal">
            ({t.breadcrumb.escBack})
          </span>
        </div>
      )}
    </div>
  );
}
