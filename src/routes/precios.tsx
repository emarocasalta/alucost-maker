import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, Save, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: "Precios — AluCost Salta" },
      { name: "description", content: "Administrá los precios base de aluminio, vidrios, accesorios y mano de obra." },
    ],
  }),
  component: Precios,
});

type Row = { id: string; nombre: string; detalle: string; unidad: string; precio: number };

const aluminioInit: Row[] = [
  { id: "a1", nombre: "Herrero", detalle: "Blanco", unidad: "$/kg", precio: 4200 },
  { id: "a2", nombre: "Herrero", detalle: "Negro", unidad: "$/kg", precio: 4830 },
  { id: "a3", nombre: "Modena", detalle: "Blanco", unidad: "$/kg", precio: 5800 },
  { id: "a4", nombre: "Modena", detalle: "Anodizado Natural", unidad: "$/kg", precio: 6090 },
  { id: "a5", nombre: "A30", detalle: "Bronce", unidad: "$/kg", precio: 8640 },
];

const vidriosInit: Row[] = [
  { id: "v1", nombre: "Float 4mm", detalle: "Transparente", unidad: "$/m²", precio: 8500 },
  { id: "v2", nombre: "Laminado 3+3", detalle: "Seguridad", unidad: "$/m²", precio: 14200 },
  { id: "v3", nombre: "Laminado 4+4", detalle: "Seguridad reforzado", unidad: "$/m²", precio: 17800 },
  { id: "v4", nombre: "DVH (recargo)", detalle: "Doble vidriado hermético", unidad: "$/m²", precio: 9500 },
];

const accesoriosInit: Row[] = [
  { id: "x1", nombre: "Kit accesorios estándar", detalle: "Ruedas, cierres, felpas", unidad: "$/unidad", precio: 18000 },
  { id: "x2", nombre: "Cerradura premium", detalle: "Multipunto", unidad: "$/unidad", precio: 24500 },
  { id: "x3", nombre: "Mano de obra · armado", detalle: "Costo por m²", unidad: "$/m²", precio: 22000 },
  { id: "x4", nombre: "Instalación en obra", detalle: "Base + por m²", unidad: "$ base", precio: 35000 },
];

function Precios() {
  const [tab, setTab] = useState("aluminio");
  const [aluminio, setAluminio] = useState(aluminioInit);
  const [vidrios, setVidrios] = useState(vidriosInit);
  const [accesorios, setAccesorios] = useState(accesoriosInit);
  const [pct, setPct] = useState(15);

  const dataMap = { aluminio, vidrios, accesorios };
  const setMap = { aluminio: setAluminio, vidrios: setVidrios, accesorios: setAccesorios };

  const applyBulk = () => {
    const key = tab as keyof typeof dataMap;
    const factor = 1 + pct / 100;
    setMap[key]((rows) => rows.map((r) => ({ ...r, precio: Math.round(r.precio * factor) })));
    toast.success(`Aumento del ${pct}% aplicado a ${key}.`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Administración</div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Precios base</h1>
          <p className="text-muted-foreground mt-1">Mantené actualizados los costos de tus proveedores de Salta.</p>
        </div>
        <Button variant="outline" className="gap-2"><Save className="h-4 w-4" /> Guardar cambios</Button>
      </div>

      {/* Bulk update */}
      <Card className="p-5 border-accent/30 bg-accent/5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent/15 text-accent flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-semibold">Actualización masiva</div>
              <div className="text-sm text-muted-foreground">Aplicá un aumento porcentual a todos los precios de la pestaña activa.</div>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pct">Porcentaje</Label>
              <div className="relative">
                <Input id="pct" type="number" min={-50} max={200} step={0.5} className="w-32 pr-8"
                  value={pct} onChange={(e) => setPct(Number(e.target.value) || 0)} />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={applyBulk} className="gap-2">
              <TrendingUp className="h-4 w-4" /> Aplicar aumento general
            </Button>
          </div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="aluminio">Aluminio</TabsTrigger>
          <TabsTrigger value="vidrios">Vidrios</TabsTrigger>
          <TabsTrigger value="accesorios">Accesorios y Mano de Obra</TabsTrigger>
        </TabsList>

        <TabsContent value="aluminio"><PriceTable rows={aluminio} onChange={setAluminio} nameLabel="Línea" detailLabel="Color" /></TabsContent>
        <TabsContent value="vidrios"><PriceTable rows={vidrios} onChange={setVidrios} nameLabel="Tipo" detailLabel="Detalle" /></TabsContent>
        <TabsContent value="accesorios"><PriceTable rows={accesorios} onChange={setAccesorios} nameLabel="Concepto" detailLabel="Detalle" /></TabsContent>
      </Tabs>
    </div>
  );
}

function PriceTable({
  rows, onChange, nameLabel, detailLabel,
}: { rows: Row[]; onChange: (r: Row[]) => void; nameLabel: string; detailLabel: string }) {
  const update = (id: string, precio: number) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, precio } : r)));
  };
  return (
    <Card className="overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{nameLabel}</TableHead>
              <TableHead>{detailLabel}</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right w-48">Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{r.detalle}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{r.unidad}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-muted-foreground text-sm">$</span>
                    <Input type="number" value={r.precio} onChange={(e) => update(r.id, Number(e.target.value) || 0)}
                      className="w-32 text-right font-mono tabular-nums" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
