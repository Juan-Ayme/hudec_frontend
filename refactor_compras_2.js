const fs = require('fs');
const pagePath = 'src/app/compras-catalogo/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const drawerJSX = `
      {/* Drawer de Filtros Avanzados */}
      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros de Catálogo"
        subtitle="Segmenta tu tabla de compras sugeridas."
        icon={SlidersHorizontal}
        width="sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="space-y-6">
              {/* Bloque: Severidad */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-faint">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Severidad del Quiebre</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  <FilterChip label="Todas" active={fSeveridad === "todas"} onClick={() => setFSeveridad("todas")} />
                  <FilterChip label="🔴 Crítico" active={fSeveridad === "critico"} onClick={() => setFSeveridad("critico")} tone="danger" />
                  <FilterChip label="🟠 Alta" active={fSeveridad === "alta"} onClick={() => setFSeveridad("alta")} tone="warning" />
                </div>
              </div>

              {/* Bloque: Tendencia */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-faint">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Tendencia de Demanda</span>
                </div>
                <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Compara los últimos 30 días vs los 90 días históricos.</p>
                <div className="flex flex-wrap gap-2 pl-6">
                  <FilterChip label="Todas" active={fTendencia === "todas"} onClick={() => setFTendencia("todas")} />
                  <FilterChip label="📈 Creciente" active={fTendencia === "creciente"} onClick={() => setFTendencia("creciente")} tone="success" />
                  <FilterChip label="➡️ Estable" active={fTendencia === "estable"} onClick={() => setFTendencia("estable")} tone="primary" />
                  <FilterChip label="📉 Decreciente" active={fTendencia === "decreciente"} onClick={() => setFTendencia("decreciente")} tone="warning" />
                </div>
              </div>

              {/* Bloque: Stock en Almacén */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-faint">
                  <Archive className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Stock en Almacén Central</span>
                </div>
                <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">¿Tenemos unidades en CD para trasladar inmediatamente?</p>
                <div className="flex flex-wrap gap-2 pl-6">
                  <FilterChip label="Todos" active={fStockAlmacen === "todos"} onClick={() => setFStockAlmacen("todos")} />
                  <FilterChip label="🏢 Con Stock Central" active={fStockAlmacen === "con_stock"} onClick={() => setFStockAlmacen("con_stock")} tone="success" />
                  <FilterChip label="⚠️ Sin Stock Central" active={fStockAlmacen === "sin_stock"} onClick={() => setFStockAlmacen("sin_stock")} tone="danger" />
                </div>
              </div>
            </div>
          </div>
          {/* Drawer Footer */}
          <div className="shrink-0 border-t border-border-soft bg-surface-2 p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border-soft bg-surface-1 hover:bg-surface-3 hover:text-fg text-muted"
                onClick={() => {
                  setFSeveridad("todas");
                  setFTendencia("todas");
                  setFStockAlmacen("todos");
                }}
              >
                Limpiar todo
              </Button>
              <Button
                className="flex-1 bg-primary text-black hover:bg-primary/90 font-semibold"
                onClick={() => setShowFilters(false)}
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
`;

pageContent = pageContent.replace(
  '{/* Drawer de detalle SKU — gráfico histórico + métricas + acciones */}',
  drawerJSX + '\n      {/* Drawer de detalle SKU — gráfico histórico + métricas + acciones */}'
);

const filterChipComponent = `
function FilterChip({
  label,
  active,
  onClick,
  tone = "primary",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "violet";
}) {
  const toneStyles: Record<string, string> = {
    primary: "border-primary/50 bg-primary/10 text-primary shadow-[0_0_12px_rgba(99,102,241,0.2)] backdrop-blur-md",
    success: "border-success/50 bg-success/10 text-success shadow-[0_0_12px_rgba(45,212,167,0.2)] backdrop-blur-md",
    warning: "border-warning/50 bg-warning/10 text-warning shadow-[0_0_12px_rgba(245,166,35,0.2)] backdrop-blur-md",
    danger: "border-danger/50 bg-danger/10 text-danger shadow-[0_0_12px_rgba(240,85,109,0.2)] backdrop-blur-md",
    info: "border-info/50 bg-info/10 text-info shadow-[0_0_12px_rgba(56,189,248,0.2)] backdrop-blur-md",
    violet: "border-violet/50 bg-violet/10 text-violet shadow-[0_0_12px_rgba(167,139,250,0.2)] backdrop-blur-md",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group inline-flex flex-1 sm:flex-none justify-center items-center gap-1.5 rounded-lg border px-2.5 py-1.5",
        "text-xs font-medium whitespace-nowrap",
        "transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)]",
        active
          ? toneStyles[tone]
          : "border-border/40 bg-surface-2/40 text-muted hover:border-border hover:bg-surface-3/60 hover:text-fg backdrop-blur-sm hover:scale-[1.02]",
      )}
    >
      <span>{label}</span>
    </button>
  );
}
`;

pageContent += filterChipComponent;

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("Drawer and FilterChip added");
