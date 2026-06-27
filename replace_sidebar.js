const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const replacement = `                <ul className="mt-1 flex max-h-[65vh] flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar">
                  {jerarquia.map((dept, deptIdx) => {
                    const isDeptSel = deptoSel === dept.name;
                    const isDeptExpanded = expandedDeptos.has(dept.name);
                    const deptTone = DEPT_COLORS[deptIdx % DEPT_COLORS.length];

                    return (
                      <li key={dept.name}>
                        <div
                          className={cn(
                            "group flex w-full items-start gap-0.5 rounded-xl transition-all border border-transparent",
                            "duration-[var(--duration-fast)] ease-[var(--ease-premium)]",
                            isDeptSel && !catSel
                              ? \`\${deptTone.bgActive} border-white/10 shadow-sm\`
                              : "hover:bg-surface-2",
                          )}
                        >
                          <button
                            onClick={() => toggleDepto(dept.name)}
                            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-faint transition-all hover:bg-surface-3 hover:text-muted"
                            aria-label={isDeptExpanded ? "Colapsar" : "Expandir"}
                          >
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)]",
                                isDeptExpanded && "rotate-90",
                              )}
                            />
                          </button>

                          <button
                            onClick={() => selectDepto(dept.name)}
                            className="relative flex min-w-0 flex-1 flex-col justify-center py-2.5 pr-3 text-left overflow-hidden"
                          >
                            <div className="flex items-center justify-between gap-3 w-full mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full shadow-sm", deptTone.dot)} />
                                <p className="truncate text-[0.8rem] font-semibold text-fg/90">
                                  {dept.name}
                                </p>
                              </div>
                              <p className="font-mono text-[0.75rem] tabular-nums font-bold text-fg shrink-0">
                                {money(dept.ventas)}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between w-full pl-4.5 mt-0.5 mb-1.5">
                              <div className="flex items-center gap-2 shrink-0">
                                <HealthBadge paraComprar={dept.paraComprar} saludables={dept.saludables} compact={!isDeptSel} />
                              </div>
                              <div className="flex items-center gap-2 text-[0.65rem] text-muted font-medium shrink-0 ml-2">
                                <span className="px-1.5 py-0.5 rounded bg-surface-3/50">{pct(dept.pct * 100)}</span>
                                <span>•</span>
                                <span>{num(dept.skuCount)} SKUs</span>
                              </div>
                            </div>
                            
                            {/* Barra de progreso de ventas integrada */}
                            <div className="absolute bottom-0 left-4 right-3 h-[2px] bg-black/20 rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-[var(--duration-slow)] ease-out", deptTone.bar)} style={{ width: \`\${dept.pct * 100}%\` }} />
                            </div>
                          </button>
                        </div>

                        {isDeptExpanded && dept.cats.length > 0 && (
                          <ul className="ml-3.5 mt-1 mb-2 animate-tree-expand overflow-hidden border-l border-white/5 pl-1.5 flex flex-col gap-0.5">
                            {dept.cats.map((cat) => {
                              const catKey = \`\${dept.name}::\${cat.name}\`;
                              const isCatSel = isDeptSel && catSel === cat.name;
                              const isCatExpanded = expandedCats.has(catKey);

                              return (
                                <li key={cat.name}>
                                  <div
                                    className={cn(
                                      "group flex w-full items-start gap-0.5 rounded-lg transition-all",
                                      "duration-[var(--duration-fast)] ease-[var(--ease-premium)]",
                                      isCatSel && !subcatSel
                                        ? "bg-info/10 shadow-[inset_3px_0_0_var(--color-info)]"
                                        : "hover:bg-surface-2",
                                    )}
                                  >
                                    <button
                                      onClick={() => toggleCat(dept.name, cat.name)}
                                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-faint transition-colors hover:bg-surface-3 hover:text-muted"
                                      aria-label={isCatExpanded ? "Colapsar" : "Expandir"}
                                    >
                                      <ChevronRight
                                        className={cn(
                                          "h-3 w-3 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)]",
                                          isCatExpanded && "rotate-90",
                                        )}
                                      />
                                    </button>

                                    <button
                                      onClick={() => selectCat(dept.name, cat.name)}
                                      className="relative flex min-w-0 flex-1 flex-col justify-center py-2 pr-3 text-left"
                                    >
                                      <div className="flex items-center justify-between gap-2 w-full mb-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <FolderOpen className={cn("h-3 w-3 shrink-0 transition-colors", isCatSel ? "text-info" : "text-faint")} />
                                          <p className={cn("truncate text-[0.7rem] font-medium transition-colors", isCatSel ? "text-info-fg font-semibold" : "text-fg/80")}>
                                            {cat.name}
                                          </p>
                                        </div>
                                        <p className="font-mono text-[0.7rem] tabular-nums font-semibold text-fg/90 shrink-0">
                                          {money(cat.ventas)}
                                        </p>
                                      </div>
                                      
                                      <div className="flex items-center justify-between w-full pl-5 mb-1.5">
                                         <div className="shrink-0">
                                           <HealthBadge paraComprar={cat.paraComprar} saludables={cat.saludables} compact />
                                         </div>
                                         <div className="flex items-center gap-1.5 text-[0.6rem] text-faint ml-2 shrink-0">
                                            <span className="px-1 rounded bg-surface-3/30">{pct(cat.pct * 100)}</span>
                                            <span>•</span>
                                            <span>{num(cat.skuCount)} SKUs</span>
                                         </div>
                                      </div>
                                      <div className="absolute bottom-0 left-5 right-3 h-[1px] bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-info/60 transition-all duration-[var(--duration-slow)] ease-out" style={{ width: \`\${cat.pct * 100}%\` }} />
                                      </div>
                                    </button>
                                  </div>

                                  {isCatExpanded && cat.subcats.length > 0 && (
                                    <ul className="ml-3 mt-0.5 mb-1 animate-tree-expand overflow-hidden border-l border-white/5 pl-1.5 flex flex-col gap-0.5">
                                      {cat.subcats.map((subcat) => {
                                        const isSubcatSel = isCatSel && subcatSel === subcat.name;

                                        return (
                                          <li key={subcat.name}>
                                            <button
                                              onClick={() => selectSubcat(dept.name, cat.name, subcat.name)}
                                              className={cn(
                                                "group relative flex w-full flex-col justify-center py-2 pl-4 pr-3 text-left transition-all rounded-md",
                                                "duration-[var(--duration-fast)] ease-[var(--ease-premium)]",
                                                isSubcatSel
                                                  ? "bg-violet/10 shadow-[inset_3px_0_0_var(--color-violet)]"
                                                  : "hover:bg-surface-2",
                                              )}
                                            >
                                              <div className="flex items-center justify-between gap-2 w-full mb-0.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <Tag className={cn("h-3 w-3 shrink-0 transition-colors", isSubcatSel ? "text-violet" : "text-faint")} />
                                                  <p className={cn("truncate text-[0.65rem] transition-colors", isSubcatSel ? "text-violet-fg font-semibold" : "text-fg/80 font-medium")}>
                                                    {subcat.name}
                                                  </p>
                                                </div>
                                                <p className="font-mono text-[0.65rem] tabular-nums font-semibold text-fg/90 shrink-0">
                                                  {money(subcat.ventas)}
                                                </p>
                                              </div>
                                              
                                              <div className="flex items-center justify-between w-full pl-5">
                                                <div className="shrink-0 scale-90 origin-left">
                                                  <HealthBadge paraComprar={subcat.paraComprar} saludables={subcat.saludables} compact />
                                                </div>
                                                <div className="flex items-center gap-1 text-[0.55rem] text-faint ml-2 shrink-0">
                                                  <span className="px-1 rounded bg-surface-3/30">{pct(subcat.pct * 100)}</span>
                                                  <span>•</span>
                                                  <span>{num(subcat.skuCount)} SKUs</span>
                                                </div>
                                              </div>
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>`;

const startIndex = pageContent.indexOf('<ul className="mt-1 flex max-h-[65vh] flex-col gap-0.5 overflow-y-auto pr-1">');
const endIndex = pageContent.indexOf('              </CardBody>', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = pageContent.substring(0, startIndex) + replacement + '\n' + pageContent.substring(endIndex);
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log("Success");
} else {
  console.error("Could not find boundaries");
}
