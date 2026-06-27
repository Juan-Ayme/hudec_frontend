const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const replacement = `                      {/* Mes de Ingreso Block (Básico) */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 mb-0.5">
                          <div className="flex items-center gap-2 text-faint">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Mes de Ingreso</span>
                          </div>
                          <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Filtra los productos por su fecha de lanzamiento o primer ingreso al sistema.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          <FilterChip 
                            label="Todos" 
                            active={fMesIngreso.size === 0} 
                            onClick={() => setFMesIngreso(new Set())} 
                          />
                          {mesesDisponibles.map(ym => {
                            const [y, m] = ym.split("-");
                            const d = new Date(parseInt(y), parseInt(m) - 1, 1);
                            const name = new Intl.DateTimeFormat('es-PE', { month: 'short', year: '2-digit' }).format(d);
                            const label = name.charAt(0).toUpperCase() + name.slice(1);
                            return (
                              <FilterChip
                                key={ym}
                                label={label}
                                count={allRows.filter(r => { const c = r["Primer Ingreso"]; return typeof c === "string" && c.startsWith(ym); }).length}
                                active={fMesIngreso.has(ym)}
                                onClick={() => setFMesIngreso(prev => {
                                  const next = new Set(prev);
                                  if (next.has(ym)) next.delete(ym);
                                  else next.add(ym);
                                  return next;
                                })}
                                tone="violet"
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Cobertura Block (Básico) */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 mb-0.5">
                          <div className="flex items-center gap-2 text-faint">
                            <ShieldAlert className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Cobertura</span>
                          </div>
                          <p className="text-[0.65rem] text-faint/80 pl-6 leading-tight">Días de inventario restante. Ayuda a identificar quiebres de stock inminentes.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          <FilterChip label="Todos" active={fCobertura === "todos"} onClick={() => setFCobertura("todos")} />
                          <FilterChip label="🚨 < 10d" count={allRows.filter(r => n(r["Cobertura"]) <= 10).length} active={fCobertura === "critica_10"} onClick={() => setFCobertura("critica_10")} tone="danger" />
                          <FilterChip label="Crítica <15d" count={allRows.filter(r => n(r["Cobertura"]) < 15).length} active={fCobertura === "critica"} onClick={() => setFCobertura("critica")} tone="danger" />
                          <FilterChip label="Baja 15–30d" count={allRows.filter(r => { const c = n(r["Cobertura"]); return c >= 15 && c <= 30; }).length} active={fCobertura === "baja"} onClick={() => setFCobertura("baja")} tone="warning" />
                          <FilterChip label="OK >30d" count={allRows.filter(r => n(r["Cobertura"]) > 30).length} active={fCobertura === "ok"} onClick={() => setFCobertura("ok")} tone="success" />
                        </div>
                      </div>`;

const startIndex = pageContent.indexOf('{/* Mes de Ingreso Block (Básico) */}');
const endIndex = pageContent.indexOf('{/* Separator / Búsqueda Avanzada Toggle */}');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = pageContent.substring(0, startIndex) + replacement + '\n                      ' + pageContent.substring(endIndex);
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log("Success");
} else {
  console.error("Could not find boundaries", { startIndex, endIndex });
}
