const fs = require('fs');
const pagePath = 'src/app/compras-catalogo/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Revert button and remove floating div
const oldFloatingDiv = `                      {/* Filtros Flotantes */}
                      <div className="relative">
                        <Button
                          onClick={() => setShowFilters(!showFilters)}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 shrink-0 relative transition-all",
                            (fSeveridad !== "todas" || fTendencia !== "todas" || fStockAlmacen !== "todos")
                              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60"
                              : "border-border-soft bg-surface-2 hover:bg-surface-3 hover:text-fg text-muted"
                          )}
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                          <span className="hidden sm:inline font-medium">Filtros</span>
                          {(fSeveridad !== "todas" || fTendencia !== "todas" || fStockAlmacen !== "todos") && (
                            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary text-[8px] font-bold text-black flex items-center justify-center border-2 border-surface shadow-sm">
                              {(fSeveridad !== "todas" ? 1 : 0) + (fTendencia !== "todas" ? 1 : 0) + (fStockAlmacen !== "todos" ? 1 : 0)}
                            </span>
                          )}
                        </Button>
                        
                        {showFilters && (
                          <div className="absolute right-0 top-full mt-2 w-[340px] z-50 overflow-hidden rounded-xl border border-border-soft bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between border-b border-border-soft p-4">
                                <div>
                                  <h3 className="text-sm font-semibold text-fg">Filtros de Catálogo</h3>
                                  <p className="text-xs text-faint">Segmenta tu tabla de compras sugeridas.</p>
                                </div>
                                <button onClick={() => setShowFilters(false)} className="rounded-full p-1 text-faint hover:bg-surface-2 hover:text-fg transition-colors">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar max-h-[60vh]">
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
                                      <FilterChip label="🏢 Con Stock" active={fStockAlmacen === "con_stock"} onClick={() => setFStockAlmacen("con_stock")} tone="success" />
                                      <FilterChip label="⚠️ Sin Stock" active={fStockAlmacen === "sin_stock"} onClick={() => setFStockAlmacen("sin_stock")} tone="danger" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Footer */}
                              <div className="shrink-0 border-t border-border-soft bg-surface-2 p-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-border-soft bg-surface-1 hover:bg-surface-3 hover:text-fg text-muted text-xs h-8"
                                    onClick={() => {
                                      setFSeveridad("todas");
                                      setFTendencia("todas");
                                      setFStockAlmacen("todos");
                                    }}
                                  >
                                    Limpiar todo
                                  </Button>
                                  <Button
                                    className="flex-1 bg-primary text-black hover:bg-primary/90 font-semibold text-xs h-8"
                                    onClick={() => setShowFilters(false)}
                                  >
                                    Aplicar filtros
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>`;

const newButton = `                      {/* Botón de Filtros */}
                      <Button
                        onClick={() => setShowFilters(true)}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 shrink-0 relative transition-all",
                          (fSeveridad !== "todas" || fTendencia !== "todas" || fStockAlmacen !== "todos")
                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60"
                            : "border-border-soft bg-surface-2 hover:bg-surface-3 hover:text-fg text-muted"
                        )}
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                        <span className="hidden sm:inline font-medium">Filtros</span>
                        {(fSeveridad !== "todas" || fTendencia !== "todas" || fStockAlmacen !== "todos") && (
                          <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary text-[8px] font-bold text-black flex items-center justify-center border-2 border-surface shadow-sm">
                            {(fSeveridad !== "todas" ? 1 : 0) + (fTendencia !== "todas" ? 1 : 0) + (fStockAlmacen !== "todos" ? 1 : 0)}
                          </span>
                        )}
                      </Button>`;

pageContent = pageContent.replace(oldFloatingDiv, newButton);


// 2. Add Drawer at the bottom
const drawerJSX = `
      {/* Drawer de Filtros Avanzados */}
      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros Avanzados"
        subtitle="Segmenta tu tabla de compras sugeridas."
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
                  <FilterChip label="🏢 Con Stock" active={fStockAlmacen === "con_stock"} onClick={() => setFStockAlmacen("con_stock")} tone="success" />
                  <FilterChip label="⚠️ Sin Stock" active={fStockAlmacen === "sin_stock"} onClick={() => setFStockAlmacen("sin_stock")} tone="danger" />
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
                Ver Resultados
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

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("Reverted to Drawer component successfully.");
