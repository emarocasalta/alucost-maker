import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, Clock, TrendingUp, Plus, Eye, Download, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AluCost Salta" },
      { name: "description", content: "Resumen de presupuestos, métricas y actividad reciente de tu taller." },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  { label: "Presupuestos creados", value: "128", trend: "+12 este mes", icon: FileText, tone: "bg-blueprint/10 text-blueprint" },
  { label: "Aprobados", value: "47", trend: "37% de conversión", icon: CheckCircle2, tone: "bg-success/15 text-success" },
  { label: "Pendientes", value: "23", trend: "9 vencen esta semana", icon: Clock, tone: "bg-warning/20 text-warning-foreground" },
  { label: "Facturado (mes)", value: "$ 8.4M", trend: "+18% vs anterior", icon: TrendingUp, tone: "bg-accent/15 text-accent" },
];

type Estado = "Borrador" | "Enviado" | "Aprobado" | "Rechazado";
const presupuestos: { id: string; cliente: string; producto: string; total: string; fecha: string; estado: Estado }[] = [
  { id: "P-0128", cliente: "Familia Ríos",   producto: "Ventana corrediza 2 hojas", total: "$ 245.300", fecha: "Hoy",         estado: "Enviado" },
  { id: "P-0127", cliente: "Obra San Lorenzo", producto: "Paño fijo + DVH",          total: "$ 412.900", fecha: "Hoy",         estado: "Aprobado" },
  { id: "P-0126", cliente: "Marta Quiroga",  producto: "Puerta balcón",              total: "$ 318.500", fecha: "Ayer",        estado: "Borrador" },
  { id: "P-0125", cliente: "Constructora Andina", producto: "5x Ventanas oficina",   total: "$ 1.245.000", fecha: "12 jun",      estado: "Enviado" },
  { id: "P-0124", cliente: "Hugo Mendoza",   producto: "Mampara baño",               total: "$ 89.200",  fecha: "10 jun",      estado: "Rechazado" },
  { id: "P-0123", cliente: "Local Calle Alvarado", producto: "Vidriera curva",       total: "$ 567.800", fecha: "08 jun",      estado: "Aprobado" },
];

const estadoStyles: Record<Estado, string> = {
  Borrador: "bg-muted text-muted-foreground border-border",
  Enviado: "bg-blueprint/10 text-blueprint border-blueprint/20",
  Aprobado: "bg-success/15 text-success border-success/30",
  Rechazado: "bg-destructive/10 text-destructive border-destructive/20",
};

function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Resumen</div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">
            Buen día, Carlos 👋
          </h1>
          <p className="text-muted-foreground mt-1">Esto pasó en tu taller hoy.</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/cotizador"><Plus className="h-4 w-4" /> Nuevo presupuesto</Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{m.label}</div>
                <div className="font-display text-3xl font-semibold mt-2">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-2">{m.trend}</div>
              </div>
              <div className={`h-10 w-10 rounded-md flex items-center justify-center ${m.tone}`}>
                <m.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-display text-lg font-semibold">Presupuestos recientes</h2>
            <p className="text-sm text-muted-foreground">Últimos 6 presupuestos generados.</p>
          </div>
          <Button variant="ghost" size="sm">Ver todos</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presupuestos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.cliente}</TableCell>
                  <TableCell className="text-muted-foreground">{p.producto}</TableCell>
                  <TableCell className="text-muted-foreground">{p.fecha}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={estadoStyles[p.estado]}>{p.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{p.total}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Descargar PDF"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Compartir"><Share2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Más"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
