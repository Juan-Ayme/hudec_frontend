const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const replacement = `                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <div className="flex flex-col gap-6">
                      
                      {/* Mes de Ingreso Block (Básico) */}
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

                      {/* Cobertura Block (Básico) */}
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
                      
                      {/* Separator / Búsqueda Avanzada Toggle */}
                      <div className="mt-2 border-t border-white/5 pt-4">
                        <button
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-fg transition-colors w-full group"
                        >
                          <span className="flex-1 text-left">Búsqueda Avanzada</span>
                          <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:text-fg", showAdvancedFilters && "rotate-90")} />
                        </button>
                      </div>

                      {/* Búsqueda Avanzada */}
                      {showAdvancedFilters && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
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
                        </div>
                      )}

                    </div>
                  </div>`;

const startIndex = pageContent.indexOf('<div className="flex-1 overflow-y-auto p-5 custom-scrollbar">');
const endIndex = pageContent.indexOf('                  <div className="border-t border-white/10 p-4 bg-surface/80 backdrop-blur-md flex justify-end gap-3">', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = pageContent.substring(0, startIndex) + replacement + '\n' + pageContent.substring(endIndex);
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log("Success");
} else {
  console.error("Could not find boundaries", { startIndex, endIndex });
}
