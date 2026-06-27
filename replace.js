const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const replacement = `            {/* Ambient glow behind main area */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet/5 pointer-events-none" />
            
            {/* Tabs de categoría Kanban (Segmented Control style) */}
            <div className="border-b border-white/5 bg-surface-2/40 relative z-10">
              <div className="flex gap-2 overflow-x-auto px-5 py-3 custom-scrollbar">
                {KANBAN_COLS.map((col) => {
                  const count = tabCounts[col.id];
                  const isActive = activeTab === col.id;
                  const Icon = col.icon;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setActiveTab(col.id)}
                      className={cn(
                        "group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-[var(--duration-fast)]",
                        isActive
                          ? TAB_ACTIVE_BORDER[col.tone]
                          : "border-transparent text-muted hover:bg-surface-2 hover:text-fg hover:border-white/10",
                        isActive && "shadow-sm"
                      )}
                      aria-pressed={isActive}
                      title={col.label}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isActive ? TAB_TONE_ACTIVE[col.tone] : TAB_TONE_INACTIVE[col.tone],
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.25} />
                      </span>
                      <span className={cn(isActive ? "text-fg" : "")}>
                        <span className="hidden md:inline">{col.label}</span>
                        <span className="md:hidden">{col.short}</span>
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.65rem] font-bold tabular-nums",
                          isActive ? TAB_BADGE_ACTIVE[col.tone] : TAB_BADGE_INACTIVE[col.tone],
                        )}
                      >
                        {num(count)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toolbar superior (Búsqueda, Filtros, Excel) */}
            <div className="flex flex-col gap-3 border-b border-white/5 bg-surface/60 px-5 py-3 relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <Input
                    placeholder="Buscar SKU o producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="h-10 bg-black/20 pl-9 border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/30 transition-all rounded-lg shadow-inner text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-10 shrink-0 transition-colors rounded-lg px-4",
                    showFilters
                      ? "border-violet bg-violet text-white shadow-sm shadow-violet/30 hover:bg-violet/90"
                      : hasActiveFilters
                        ? "border-violet/50 bg-violet/20 text-violet hover:bg-violet/30 hover:border-violet/70"
                        : "border-violet/30 bg-violet/10 text-violet hover:bg-violet/20 hover:border-violet/50",
                  )}
                  onClick={() => setShowFilters((v) => !v)}
                  aria-pressed={showFilters}
                  title="Filtros avanzados"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline font-semibold">Filtros</span>
                  {hasActiveFilters && (
                    <span
                      className={cn(
                        "ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-bold",
                        showFilters ? "bg-white text-violet" : "bg-violet text-white",
                      )}
                      aria-label="Filtros activos"
                    >
                      !
                    </span>
                  )}
                </Button>
                <a
                  href={matrixExcelUrl("04b", {
                    sucursal: sucursalName ?? undefined,
                  })}
                  target="_blank"
                  rel="noopener"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 shrink-0 rounded-lg border-success/40 bg-success/12 text-success transition-colors hover:bg-success/25 hover:border-success/60 px-4 font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Excel</span>
                  </Button>
                </a>
              </div>

              {/* Active Filters Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 animate-[fade-in-up_var(--duration-fast)_var(--ease-premium)_both]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-1">Filtros Activos:</span>
                  {fStock !== "todos" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      Stock: {fStock === "con_stock" ? "Con stock" : "Agotado"}
                      <button onClick={() => setFStock("todos")} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {fDias !== "todos" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      Estancamiento: &gt;{fDias} días
                      <button onClick={() => setFDias("todos")} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {fMesIngreso.size > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      Meses: {fMesIngreso.size} selec.
                      <button onClick={() => setFMesIngreso(new Set())} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {fXYZ !== "todos" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      XYZ: {fXYZ}
                      <button onClick={() => setFXYZ("todos")} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {fTendencia !== "todos" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      Tendencia: {fTendencia}
                      <button onClick={() => setFTendencia("todos")} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {fCobertura !== "todos" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 pl-2 pr-1 py-1 text-xs text-fg shadow-sm border border-white/5">
                      Cobertura: {fCobertura}
                      <button onClick={() => setFCobertura("todos")} className="rounded-full p-0.5 hover:bg-surface-active"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  
                  <button 
                    onClick={() => { setFStock("todos"); setFDias("todos"); setFMesIngreso(new Set()); setFXYZ("todos"); setFTendencia("todos"); setFCobertura("todos"); }}
                    className="ml-auto text-[0.7rem] font-semibold text-danger hover:underline"
                  >
                    Limpiar todos
                  </button>
                </div>
              )}
            </div>

            {/* Panel Lateral de Filtros (Drawer) */}
            {showFilters && (
              <div className="absolute inset-0 z-50 flex justify-end">
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fade-in_var(--duration-fast)_ease-out]" 
                  onClick={() => setShowFilters(false)}
                />
                
                {/* Panel lateral */}
                <div className="relative w-full max-w-sm flex flex-col bg-surface border-l border-white/10 shadow-2xl animate-[slide-in-right_var(--duration-slow)_var(--ease-premium)] h-full overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 p-4 bg-surface/50 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-fg flex items-center gap-2">
                      <Filter className="h-5 w-5 text-violet" />
                      Filtros Avanzados
                    </h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-fg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <div className="flex flex-col gap-6">
                      {/* Stock Block */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <Package className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Stock Disponible</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip label="Todos" active={fStock === "todos"} onClick={() => setFStock("todos")} />
                          <FilterChip label="Con stock" count={allRows.filter(r => n(r["Stock Disp"]) > 0).length} active={fStock === "con_stock"} onClick={() => setFStock("con_stock")} tone="success" />
                          <FilterChip label="Agotado" count={allRows.filter(r => n(r["Stock Disp"]) <= 0).length} active={fStock === "sin_stock"} onClick={() => setFStock("sin_stock")} tone="danger" />
                        </div>
                      </div>

                      {/* Estancamiento Block */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <Timer className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Estancamiento</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip label="Todos" active={fDias === "todos"} onClick={() => setFDias("todos")} />
                          <FilterChip label=">7 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 7).length} active={fDias === "7"} onClick={() => setFDias("7")} tone="warning" />
                          <FilterChip label=">15 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 15).length} active={fDias === "15"} onClick={() => setFDias("15")} tone="warning" />
                          <FilterChip label=">30 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 30).length} active={fDias === "30"} onClick={() => setFDias("30")} tone="danger" />
                        </div>
                      </div>

                      {/* Mes de Ingreso Block */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Mes de Ingreso</span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setMesDropdownOpen(!mesDropdownOpen)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-[var(--duration-fast)]",
                              fMesIngreso.size > 0
                                ? "border-violet/40 bg-violet/12 text-violet shadow-sm"
                                : "border-border-soft bg-surface-2 text-muted hover:bg-surface-3 hover:text-fg hover:border-border",
                            )}
                          >
                            <span className="flex items-center gap-2 text-sm">
                              {fMesIngreso.size === 0 ? "Todos los meses" : \`\${fMesIngreso.size} meses seleccionados\`}
                            </span>
                            <ChevronRight className={cn("h-4 w-4 transition-transform", mesDropdownOpen && "rotate-90")} />
                          </button>
                          {mesDropdownOpen && (
                            <div className="mt-2 flex flex-col gap-1 rounded-lg border border-border-soft bg-surface-2/50 p-2 shadow-inner">
                              {mesesDisponibles.map(ym => {
                                const [y, m] = ym.split("-");
                                const d = new Date(parseInt(y), parseInt(m) - 1, 1);
                                const name = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(d);
                                const label = name.charAt(0).toUpperCase() + name.slice(1);
                                return (
                                  <label key={ym} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-white/5 text-sm text-fg transition-colors">
                                    <input type="checkbox" checked={fMesIngreso.has(ym)}
                                      onChange={(e) => { setFMesIngreso(prev => { const next = new Set(prev); if (e.target.checked) next.add(ym); else next.delete(ym); return next; }); }}
                                      className="rounded border-border-soft text-primary focus:ring-primary h-4 w-4 bg-surface"
                                    />
                                    {label}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* XYZ */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <Target className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Categorización XYZ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip label="Todos" active={fXYZ === "todos"} onClick={() => setFXYZ("todos")} />
                          <FilterChip label="X (frecuente)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("X")).length} active={fXYZ === "X"} onClick={() => setFXYZ("X")} tone="success" />
                          <FilterChip label="Y (moderado)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("Y")).length} active={fXYZ === "Y"} onClick={() => setFXYZ("Y")} tone="info" />
                          <FilterChip label="Z (esporádico)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("Z")).length} active={fXYZ === "Z"} onClick={() => setFXYZ("Z")} tone="warning" />
                        </div>
                      </div>

                      {/* Tendencia */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <BarChart2 className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Tendencia</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip label="Todos" active={fTendencia === "todos"} onClick={() => setFTendencia("todos")} />
                          <FilterChip label="↑ Creciendo" count={allRows.filter(r => s(r["Tendencia"]).toUpperCase().includes("CRECIENDO")).length} active={fTendencia === "creciendo"} onClick={() => setFTendencia("creciendo")} tone="success" />
                          <FilterChip label="→ Estable" count={allRows.filter(r => { const t = s(r["Tendencia"]).toUpperCase(); return !t.includes("CRECIENDO") && !t.includes("BAJANDO"); }).length} active={fTendencia === "estable"} onClick={() => setFTendencia("estable")} tone="info" />
                          <FilterChip label="↓ Bajando" count={allRows.filter(r => s(r["Tendencia"]).toUpperCase().includes("BAJANDO")).length} active={fTendencia === "bajando"} onClick={() => setFTendencia("bajando")} tone="danger" />
                        </div>
                      </div>

                      {/* Cobertura */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-faint mb-0.5">
                          <ShieldAlert className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">Cobertura</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip label="Todos" active={fCobertura === "todos"} onClick={() => setFCobertura("todos")} />
                          <FilterChip label="🚨 < 10d" count={allRows.filter(r => n(r["Cobertura"]) <= 10).length} active={fCobertura === "critica_10"} onClick={() => setFCobertura("critica_10")} tone="danger" />
                          <FilterChip label="Crítica <15d" count={allRows.filter(r => n(r["Cobertura"]) < 15).length} active={fCobertura === "critica"} onClick={() => setFCobertura("critica")} tone="danger" />
                          <FilterChip label="Baja 15–30d" count={allRows.filter(r => { const c = n(r["Cobertura"]); return c >= 15 && c <= 30; }).length} active={fCobertura === "baja"} onClick={() => setFCobertura("baja")} tone="warning" />
                          <FilterChip label="OK >30d" count={allRows.filter(r => n(r["Cobertura"]) > 30).length} active={fCobertura === "ok"} onClick={() => setFCobertura("ok")} tone="success" />
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 p-4 bg-surface/80 backdrop-blur-md flex justify-end gap-3">
                    {hasActiveFilters && (
                      <Button variant="ghost" onClick={() => { setFStock("todos"); setFDias("todos"); setFMesIngreso(new Set()); setFXYZ("todos"); setFTendencia("todos"); setFCobertura("todos"); }} className="text-danger hover:bg-danger/10 hover:text-danger">
                        Limpiar
                      </Button>
                    )}
                    <Button onClick={() => setShowFilters(false)} className="bg-violet hover:bg-violet/90 text-white shadow-md shadow-violet/20">
                      Ver Resultados
                    </Button>
                  </div>
                </div>
              </div>
            )}`;

const startIndex = pageContent.indexOf('{/* Ambient glow behind main area */}');
const endIndex = pageContent.indexOf('{/* Lista del tab activo (scroll interno) */}');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = pageContent.substring(0, startIndex) + replacement + '\n            ' + pageContent.substring(endIndex);
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log("Success");
} else {
  console.error("Could not find boundaries");
}
