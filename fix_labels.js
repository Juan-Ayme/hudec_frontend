const fs = require('fs');
const pagePath = 'src/app/ventas-jerarquicas/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Modificando Mes de Ingreso
const mesDeIngresoOld = `<div className="flex flex-wrap gap-2 pl-6">
                          <FilterChip 
                            label="Todos" 
                            active={fMesIngreso.size === 0} 
                            onClick={() => setFMesIngreso(new Set())} 
                          />`;
const mesDeIngresoNew = `<div className="flex flex-wrap gap-2 pl-6 max-h-[160px] overflow-y-auto custom-scrollbar pr-2 pb-1">
                          <FilterChip 
                            label="Todos" 
                            active={fMesIngreso.size === 0} 
                            onClick={() => setFMesIngreso(new Set())} 
                          />`;
                          
pageContent = pageContent.replace(mesDeIngresoOld, mesDeIngresoNew);

// Modificando Cobertura
const coberturaOld = `<FilterChip label="Todos" active={fCobertura === "todos"} onClick={() => setFCobertura("todos")} />
                          <FilterChip label="🚨 < 10d" count={allRows.filter(r => n(r["Cobertura"]) <= 10).length} active={fCobertura === "critica_10"} onClick={() => setFCobertura("critica_10")} tone="danger" />
                          <FilterChip label="Crítica <15d" count={allRows.filter(r => n(r["Cobertura"]) < 15).length} active={fCobertura === "critica"} onClick={() => setFCobertura("critica")} tone="danger" />
                          <FilterChip label="Baja 15–30d" count={allRows.filter(r => { const c = n(r["Cobertura"]); return c >= 15 && c <= 30; }).length} active={fCobertura === "baja"} onClick={() => setFCobertura("baja")} tone="warning" />
                          <FilterChip label="OK >30d" count={allRows.filter(r => n(r["Cobertura"]) > 30).length} active={fCobertura === "ok"} onClick={() => setFCobertura("ok")} tone="success" />`;

const coberturaNew = `<FilterChip label="Todos" active={fCobertura === "todos"} onClick={() => setFCobertura("todos")} />
                          <FilterChip label="🚨 Crítico (< 10d)" count={allRows.filter(r => n(r["Cobertura"]) <= 10).length} active={fCobertura === "critica_10"} onClick={() => setFCobertura("critica_10")} tone="danger" />
                          <FilterChip label="⚠️ Alerta (10–15d)" count={allRows.filter(r => n(r["Cobertura"]) < 15 && n(r["Cobertura"]) > 10).length} active={fCobertura === "critica"} onClick={() => setFCobertura("critica")} tone="danger" />
                          <FilterChip label="📉 Bajo (15–30d)" count={allRows.filter(r => { const c = n(r["Cobertura"]); return c >= 15 && c <= 30; }).length} active={fCobertura === "baja"} onClick={() => setFCobertura("baja")} tone="warning" />
                          <FilterChip label="✅ Óptimo (> 30d)" count={allRows.filter(r => n(r["Cobertura"]) > 30).length} active={fCobertura === "ok"} onClick={() => setFCobertura("ok")} tone="success" />`;

pageContent = pageContent.replace(coberturaOld, coberturaNew);

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("Success");
