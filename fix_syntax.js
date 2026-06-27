const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const advancedFiltersReplacement = `
                      {/* Búsqueda Avanzada */}
                      {showAdvancedFilters && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-300 pb-10">
                          {/* Stock Block */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1 mb-0.5">
                              <div className="flex items-center gap-2 text-faint">
                                <Package className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">Stock Disponible</span>
                              </div>
                              <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Muestra únicamente los productos que actualmente tienen o no inventario físico en el almacén.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              <FilterChip label="Todos" active={fStock === "todos"} onClick={() => setFStock("todos")} />
                              <FilterChip label="Con stock" count={allRows.filter(r => n(r["Stock Disp"]) > 0).length} active={fStock === "con_stock"} onClick={() => setFStock("con_stock")} tone="success" />
                              <FilterChip label="Agotado" count={allRows.filter(r => n(r["Stock Disp"]) <= 0).length} active={fStock === "sin_stock"} onClick={() => setFStock("sin_stock")} tone="danger" />
                            </div>
                          </div>

                          {/* Estancamiento Block */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1 mb-0.5">
                              <div className="flex items-center gap-2 text-faint">
                                <Timer className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">Estancamiento</span>
                              </div>
                              <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Días consecutivos sin registrar ninguna venta. Útil para identificar productos "hueso".</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              <FilterChip label="Todos" active={fDias === "todos"} onClick={() => setFDias("todos")} />
                              <FilterChip label=">7 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 7).length} active={fDias === "7"} onClick={() => setFDias("7")} tone="warning" />
                              <FilterChip label=">15 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 15).length} active={fDias === "15"} onClick={() => setFDias("15")} tone="warning" />
                              <FilterChip label=">30 días" count={allRows.filter(r => n(r["Días sin Vender"]) >= 30).length} active={fDias === "30"} onClick={() => setFDias("30")} tone="danger" />
                            </div>
                          </div>

                          {/* XYZ */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1 mb-0.5">
                              <div className="flex items-center gap-2 text-faint">
                                <Target className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">Categorización XYZ</span>
                              </div>
                              <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Clasificación por predictibilidad de ventas. X = estable, Y = estacional, Z = errático.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              <FilterChip label="Todos" active={fXYZ === "todos"} onClick={() => setFXYZ("todos")} />
                              <FilterChip label="X (frecuente)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("X")).length} active={fXYZ === "X"} onClick={() => setFXYZ("X")} tone="success" />
                              <FilterChip label="Y (moderado)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("Y")).length} active={fXYZ === "Y"} onClick={() => setFXYZ("Y")} tone="info" />
                              <FilterChip label="Z (esporádico)" count={allRows.filter(r => s(r["XYZ"]).toUpperCase().startsWith("Z")).length} active={fXYZ === "Z"} onClick={() => setFXYZ("Z")} tone="warning" />
                            </div>
                          </div>

                          {/* Tendencia */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1 mb-0.5">
                              <div className="flex items-center gap-2 text-faint">
                                <BarChart2 className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">Tendencia</span>
                              </div>
                              <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Dirección de la curva de ventas comparando el mes actual contra el histórico reciente.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              <FilterChip label="Todos" active={fTendencia === "todos"} onClick={() => setFTendencia("todos")} />
                              <FilterChip label="↑ Creciendo" count={allRows.filter(r => s(r["Tendencia"]).toUpperCase().includes("CRECIENDO")).length} active={fTendencia === "creciendo"} onClick={() => setFTendencia("creciendo")} tone="success" />
                              <FilterChip label="→ Estable" count={allRows.filter(r => { const t = s(r["Tendencia"]).toUpperCase(); return !t.includes("CRECIENDO") && !t.includes("BAJANDO"); }).length} active={fTendencia === "estable"} onClick={() => setFTendencia("estable")} tone="info" />
                              <FilterChip label="↓ Bajando" count={allRows.filter(r => s(r["Tendencia"]).toUpperCase().includes("BAJANDO")).length} active={fTendencia === "bajando"} onClick={() => setFTendencia("bajando")} tone="danger" />
                            </div>
                          </div>
                        </div>
                      )}
`;

// Buscar desde {/* Búsqueda Avanzada */} hasta el cierre de los contenedores justo antes de los botones de pie de página
const startIndex = pageContent.indexOf('{/* Búsqueda Avanzada */}');
const endIndex = pageContent.indexOf('                    </div>\n                  </div>\n                  <div className="border-t border-white/10 p-4 bg-surface/80 backdrop-blur-md flex justify-end gap-3">');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = pageContent.substring(0, startIndex) + advancedFiltersReplacement + pageContent.substring(endIndex);
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log("Success");
} else {
  console.error("Could not find boundaries", { startIndex, endIndex });
}
