import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Save, Download, Ruler, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/cotizador")({
  head: () => ({
    meta: [
      { title: "Cotizador — AluCost Salta" },
      { name: "description", content: "Calculá presupuestos de aberturas de aluminio en tiempo real." },
    ],
  }),
  component: Cotizador,
});

// ---- Precios base (luego vendrán de Supabase) ----
const PRECIO_ALUMINIO_KG: Record<string, number> = { Herrero: 4200, Modena: 5800, A30: 7200 };
const FACTOR_KG_POR_M: Record<string, number> = { Herrero: 1.4, Modena: 1.7, A30: 2.1 };
const RECARGO_COLOR: Record<string, number> = { Blanco: 1.0, Negro: 1.15, "Anodizado Natural": 1.05, Bronce: 1.20 };
const PRECIO_VIDRIO_M2: Record<string, number> = { "Float 4mm": 8500, "Laminado 3+3": 14200, "Laminado 4+4": 17800 };
const DVH_RECARGO_M2 = 9500;
const ACCESORIOS_BASE = 18000;
const MANO_OBRA_M2 = 22000;
const INSTALACION_BASE = 35000;

const COLOR_HEX: Record<string, string> = {
  Blanco: "#e8e8ea",
  Negro: "#1f2024",
  "Anodizado Natural": "#9aa0a6",
  Bronce: "#7a5a3a",
};

type Linea = keyof typeof PRECIO_ALUMINIO_KG;
type Color = keyof typeof RECARGO_COLOR;
type Vidrio = keyof typeof PRECIO_VIDRIO_M2;

function Cotizador() {
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ancho, setAncho] = useState(1.5);
  const [alto, setAlto] = useState(1.2);
  const [linea, setLinea] = useState<Linea>("Modena");
  const [color, setColor] = useState<Color>("Blanco");
  const [vidrio, setVidrio] = useState<Vidrio>("Float 4mm");
  const [dvh, setDvh] = useState(false);
  const [instalacion, setInstalacion] = useState(true);

  const calc = useMemo(() => {
    const perimetro = 2 * (ancho + alto) + ancho; // aprox + travesaño
    const kilos = perimetro * FACTOR_KG_POR_M[linea];
    const costoAluminio = kilos * PRECIO_ALUMINIO_KG[linea] * RECARGO_COLOR[color];
    const m2 = ancho * alto;
    const costoVidrio = m2 * PRECIO_VIDRIO_M2[vidrio] + (dvh ? m2 * DVH_RECARGO_M2 : 0);
    const accesorios = ACCESORIOS_BASE;
    const manoObra = m2 * MANO_OBRA_M2;
    const costoInst = instalacion ? INSTALACION_BASE + m2 * 5000 : 0;
    const total = costoAluminio + costoVidrio + accesorios + manoObra + costoInst;
    return {
      perimetro, kilos, m2, costoAluminio, costoVidrio, accesorios, manoObra, costoInst, total,
    };
  }, [ancho, alto, linea, color, vidrio, dvh, instalacion]);

  const money = (n: number) => "$ " + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  return (
    <div className="p-4 lg:p-6 max-w-[1700px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Cotizador</div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Nuevo presupuesto</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> PDF</Button>
          <Button className="gap-2" onClick={() => toast.success("Presupuesto guardado")}><Save className="h-4 w-4" /> Guardar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_360px] gap-5">
        {/* Form panel */}
        <Card className="p-5 space-y-5 h-fit">
          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><User className="h-4 w-4 text-blueprint" /> Cliente</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cliente">Nombre</Label>
                <Input id="cliente" placeholder="Juan Pérez" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tel">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="tel" className="pl-9" placeholder="387 555 1234" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Ruler className="h-4 w-4 text-blueprint" /> Medidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ancho">Ancho (m)</Label>
                <Input id="ancho" type="number" step="0.01" min="0.3" max="6" value={ancho}
                  onChange={(e) => setAncho(Number(e.target.value) || 0)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alto">Alto (m)</Label>
                <Input id="alto" type="number" step="0.01" min="0.3" max="4" value={alto}
                  onChange={(e) => setAlto(Number(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Línea de aluminio</Label>
              <Select value={linea} onValueChange={(v) => setLinea(v as Linea)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Herrero">Herrero · económica</SelectItem>
                  <SelectItem value="Modena">Modena · estándar</SelectItem>
                  <SelectItem value="A30">A30 · premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Acabado / Color</Label>
              <Select value={color} onValueChange={(v) => setColor(v as Color)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(RECARGO_COLOR).map((c) => (
                    <SelectItem key={c} value={c}>
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm border" style={{ background: COLOR_HEX[c] }} />
                        {c}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tipo de vidrio</Label>
              <Select value={vidrio} onValueChange={(v) => setVidrio(v as Vidrio)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(PRECIO_VIDRIO_M2).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">DVH</div>
                <div className="text-xs text-muted-foreground">Doble vidriado hermético</div>
              </div>
              <Switch checked={dvh} onCheckedChange={setDvh} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Instalación</div>
                <div className="text-xs text-muted-foreground">Incluir colocación en obra</div>
              </div>
              <Switch checked={instalacion} onCheckedChange={setInstalacion} />
            </div>
          </div>
        </Card>

        {/* Visualization */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold">Vista previa</h3>
            <div className="text-xs text-muted-foreground font-mono">
              {ancho.toFixed(2)} m × {alto.toFixed(2)} m · {(ancho * alto).toFixed(2)} m²
            </div>
          </div>
          <div className="flex-1 min-h-[420px] rounded-lg bg-[var(--background)] relative overflow-hidden flex items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(var(--blueprint) 1px, transparent 1px), linear-gradient(90deg, var(--blueprint) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              backgroundColor: "color-mix(in oklab, var(--blueprint) 6%, var(--background))",
            }}
          >
            <WindowSVG ancho={ancho} alto={alto} color={color} dvh={dvh} />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2.5 w-4 rounded-sm" style={{ background: COLOR_HEX[color] }} /> Perfil {color}</span>
            <span>Línea: <strong className="text-foreground">{linea}</strong></span>
            <span>Vidrio: <strong className="text-foreground">{vidrio}{dvh ? " + DVH" : ""}</strong></span>
            <span>Instalación: <strong className="text-foreground">{instalacion ? "Sí" : "No"}</strong></span>
          </div>
        </Card>

        {/* Cost breakdown */}
        <Card className="p-5 h-fit xl:sticky xl:top-20">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Desglose</div>
          <h3 className="font-display text-lg font-semibold mt-1 mb-4">Costos estimados</h3>

          <div className="space-y-3 text-sm">
            <Row label="Aluminio" sub={`${calc.kilos.toFixed(2)} kg · ${linea}`} value={money(calc.costoAluminio)} />
            <Row label="Vidrio" sub={`${calc.m2.toFixed(2)} m² · ${vidrio}${dvh ? " + DVH" : ""}`} value={money(calc.costoVidrio)} />
            <Row label="Accesorios" sub="Ruedas, cierres, felpas" value={money(calc.accesorios)} />
            <Row label="Mano de obra" sub={`${calc.m2.toFixed(2)} m² × armado`} value={money(calc.manoObra)} />
            <Row label="Instalación" sub={instalacion ? "Colocación en obra" : "No incluida"} value={money(calc.costoInst)} muted={!instalacion} />
          </div>

          <Separator className="my-4" />

          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Total</div>
              <div className="font-display text-3xl font-semibold text-accent mt-1">{money(calc.total)}</div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              IVA incluido<br />Precio referencial
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-5">
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> PDF</Button>
            <Button className="gap-2" onClick={() => toast.success("Presupuesto guardado")}>
              <Save className="h-4 w-4" /> Guardar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, sub, value, muted }: { label: string; sub: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${muted ? "opacity-60" : ""}`}>
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="font-mono tabular-nums text-foreground">{value}</div>
    </div>
  );
}

/* ---------- Window SVG ---------- */
function WindowSVG({ ancho, alto, color, dvh }: { ancho: number; alto: number; color: string; dvh: boolean }) {
  const maxW = 520;
  const maxH = 380;
  const ratio = ancho / alto;
  let w = maxW, h = maxW / ratio;
  if (h > maxH) { h = maxH; w = maxH * ratio; }
  w = Math.max(120, w);
  h = Math.max(120, h);

  const frame = COLOR_HEX[color];
  const stroke = color === "Blanco" || color === "Anodizado Natural" ? "#5a5a60" : "#0f1014";
  const frameW = 14;
  const mullion = 10;
  const cx = w / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Top measurement */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-blueprint">
        <span className="h-px w-10 bg-blueprint" />
        <span>{ancho.toFixed(2)} m</span>
        <span className="h-px w-10 bg-blueprint" />
      </div>

      <div className="flex items-center gap-3">
        {/* Left measurement */}
        <div className="flex flex-col items-center gap-1 text-[11px] font-mono text-blueprint">
          <span className="w-px h-10 bg-blueprint" />
          <span>{alto.toFixed(2)} m</span>
          <span className="w-px h-10 bg-blueprint" />
        </div>

        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="drop-shadow-lg transition-all duration-300">
          {/* Outer frame */}
          <rect x={0} y={0} width={w} height={h} rx={4} fill={frame} stroke={stroke} strokeWidth={1.5} />
          {/* Glass area (inset by frame thickness) */}
          <rect
            x={frameW} y={frameW}
            width={w - frameW * 2} height={h - frameW * 2}
            fill={dvh ? "rgba(120, 180, 220, 0.28)" : "rgba(140, 190, 220, 0.18)"}
            stroke={dvh ? "rgb(70, 140, 200)" : "rgba(80, 130, 170, 0.5)"}
            strokeWidth={dvh ? 2 : 1}
          />
          {/* DVH second pane indicator */}
          {dvh && (
            <rect
              x={frameW + 4} y={frameW + 4}
              width={w - frameW * 2 - 8} height={h - frameW * 2 - 8}
              fill="none" stroke="rgb(70, 140, 200)" strokeWidth={1.2} strokeDasharray="3 3" opacity={0.7}
            />
          )}
          {/* Central mullion - two-leaf sliding window */}
          <rect x={cx - mullion / 2} y={frameW} width={mullion} height={h - frameW * 2} fill={frame} stroke={stroke} strokeWidth={1} />
          {/* Handles */}
          <circle cx={cx - 22} cy={h / 2} r={3} fill={stroke} />
          <circle cx={cx + 22} cy={h / 2} r={3} fill={stroke} />
          {/* Highlight on glass */}
          <line x1={frameW + 8} y1={frameW + 12} x2={cx - mullion / 2 - 12} y2={h / 3} stroke="white" strokeWidth={1} opacity={0.25} />
          <line x1={cx + mullion / 2 + 8} y1={frameW + 12} x2={w - frameW - 12} y2={h / 3} stroke="white" strokeWidth={1} opacity={0.25} />
        </svg>
      </div>

      {dvh && (
        <div className="text-[11px] text-blueprint font-medium flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-blueprint" /> DVH · Doble vidriado hermético
        </div>
      )}
    </div>
  );
}
