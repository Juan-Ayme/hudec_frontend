const fs = require('fs');
const pagePath = 'src/app/compras-catalogo/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Añadir icones a lucide-react
pageContent = pageContent.replace(
  'type LucideIcon,',
  'type LucideIcon,\n  SlidersHorizontal,'
);

// 2. Modificar estados (líneas 137-152 aprox)
const oldState = `  const [severity, setSeverity] = useState<SeverityFilter>("todas");
  const [selection, setSelection] = useState<Selection>(ROOT_SELECTION);
  const [search, setSearch] = useState("");
  const [selectedSku, setSelectedSku] = useState<ComprasCatalogoSku | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [prevSearch, setPrevSearch] = useState(search);
  const [prevSeverity, setPrevSeverity] = useState(severity);
  const [prevSelection, setPrevSelection] = useState(selection);
  if (search !== prevSearch || severity !== prevSeverity || selection !== prevSelection) {
    setPrevSearch(search);
    setPrevSeverity(severity);
    setPrevSelection(selection);
    setOffset(0);
  }`;

const newState = `  const [fSeveridad, setFSeveridad] = useState<SeverityFilter>("todas");
  const [fTendencia, setFTendencia] = useState<"todas" | "creciente" | "estable" | "decreciente">("todas");
  const [fStockAlmacen, setFStockAlmacen] = useState<"todos" | "con_stock" | "sin_stock">("todos");
  const [showFilters, setShowFilters] = useState(false);

  const [selection, setSelection] = useState<Selection>(ROOT_SELECTION);
  const [search, setSearch] = useState("");
  const [selectedSku, setSelectedSku] = useState<ComprasCatalogoSku | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [prevSearch, setPrevSearch] = useState(search);
  const [prevSeverity, setPrevSeverity] = useState(fSeveridad);
  const [prevSelection, setPrevSelection] = useState(selection);
  const [prevTendencia, setPrevTendencia] = useState(fTendencia);
  const [prevStockAlmacen, setPrevStockAlmacen] = useState(fStockAlmacen);

  if (search !== prevSearch || fSeveridad !== prevSeverity || selection !== prevSelection || fTendencia !== prevTendencia || fStockAlmacen !== prevStockAlmacen) {
    setPrevSearch(search);
    setPrevSeverity(fSeveridad);
    setPrevSelection(selection);
    setPrevTendencia(fTendencia);
    setPrevStockAlmacen(fStockAlmacen);
    setOffset(0);
  }`;
pageContent = pageContent.replace(oldState, newState);

// 3. Modificar filter logic (líneas 168-186)
const oldFilterLogic = `  const filteredSkus = useMemo<ComprasCatalogoSku[]>(() => {
    const all = query.data?.skus ?? [];
    const s = search.trim().toLowerCase();
    return all.filter((sku) => {
      if (severity === "critico" && !sku.severidad.includes("Crítico")) return false;
      if (severity === "alta" && !sku.severidad.includes("Alta")) return false;
      if (selection.dept && sku.departamento !== selection.dept) return false;
      if (selection.cat && sku.categoria !== selection.cat) return false;
      if (selection.subcat && sku.subcategoria !== selection.subcat) return false;
      if (s) {
        const hay =
          sku.sku.toLowerCase().includes(s) ||
          sku.producto.toLowerCase().includes(s) ||
          (sku.categoria ?? "").toLowerCase().includes(s);
        if (!hay) return false;
      }
      return true;
    });
  }, [query.data?.skus, severity, selection, search]);`;

const newFilterLogic = `  const filteredSkus = useMemo<ComprasCatalogoSku[]>(() => {
    const all = query.data?.skus ?? [];
    const s = search.trim().toLowerCase();
    return all.filter((sku) => {
      if (fSeveridad === "critico" && !sku.severidad.includes("Crítico")) return false;
      if (fSeveridad === "alta" && !sku.severidad.includes("Alta")) return false;
      
      if (fTendencia === "creciente" && sku.tendencia !== "Creciente") return false;
      if (fTendencia === "estable" && sku.tendencia !== "Estable") return false;
      if (fTendencia === "decreciente" && sku.tendencia !== "Decreciente") return false;

      if (fStockAlmacen === "con_stock" && sku.stock_almacen <= 0) return false;
      if (fStockAlmacen === "sin_stock" && sku.stock_almacen > 0) return false;

      if (selection.dept && sku.departamento !== selection.dept) return false;
      if (selection.cat && sku.categoria !== selection.cat) return false;
      if (selection.subcat && sku.subcategoria !== selection.subcat) return false;
      if (s) {
        const hay =
          sku.sku.toLowerCase().includes(s) ||
          sku.producto.toLowerCase().includes(s) ||
          (sku.categoria ?? "").toLowerCase().includes(s);
        if (!hay) return false;
      }
      return true;
    });
  }, [query.data?.skus, fSeveridad, fTendencia, fStockAlmacen, selection, search]);`;
pageContent = pageContent.replace(oldFilterLogic, newFilterLogic);

// 4. Modificar encabezado de la tabla (CardHeader actions)
const oldActions = `<div className="inline-flex rounded-md border border-border-soft bg-surface-2 p-0.5">
                        <SeverityTab
                          active={severity === "todas"}
                          onClick={() => setSeverity("todas")}
                        >
                          Todas
                        </SeverityTab>
                        <SeverityTab
                          active={severity === "critico"}
                          onClick={() => setSeverity("critico")}
                          accent="danger"
                        >
                          🔴 Crítico
                        </SeverityTab>
                        <SeverityTab
                          active={severity === "alta"}
                          onClick={() => setSeverity("alta")}
                          accent="warning"
                        >
                          🟠 Alta
                        </SeverityTab>
                      </div>`;

const newActions = `<Button
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
pageContent = pageContent.replace(oldActions, newActions);


fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("State and logic updated");
