import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Hammer, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — AluCost Salta" },
      { name: "description", content: "Ingresá a tu cuenta de AluCost Salta para gestionar presupuestos." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase Auth
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "linear-gradient(var(--sidebar-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--sidebar-foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
            <Hammer className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">AluCost</div>
            <div className="text-xs uppercase tracking-[0.25em] text-sidebar-foreground/60">Salta</div>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-tight">
            Presupuestá aberturas de aluminio en <span className="text-accent">segundos</span>.
          </h1>
          <p className="text-sidebar-foreground/70 max-w-md">
            Hecho para carpinteros de Salta. Cargá medidas, elegí materiales y obtené el costo final con precios actualizados de tus proveedores.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md">
            {[
              { k: "+1.200", l: "Presupuestos" },
              { k: "32%", l: "Ahorro de tiempo" },
              { k: "Salta", l: "Proveedores locales" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-semibold text-accent">{s.k}</div>
                <div className="text-xs text-sidebar-foreground/60 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} AluCost Salta
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
              <Hammer className="h-5 w-5" />
            </div>
            <div className="font-display text-lg font-semibold">AluCost Salta</div>
          </div>

          <h2 className="font-display text-3xl font-semibold tracking-tight">Bienvenido de vuelta</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Ingresá para gestionar tus presupuestos.
          </p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="taller@ejemplo.com" className="pl-9"
                      value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <button type="button" className="text-xs text-blueprint hover:underline">¿Olvidaste?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-9"
                      value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Ingresar <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="taller">Nombre del taller</Label>
                  <Input id="taller" placeholder="Carpintería Salta" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Correo electrónico</Label>
                  <Input id="email2" type="email" placeholder="taller@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass2">Contraseña</Label>
                  <Input id="pass2" type="password" placeholder="Mínimo 8 caracteres" required />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Crear cuenta <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Al continuar aceptás los términos del servicio.{" "}
            <Link to="/" className="text-blueprint hover:underline">Ver demo</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
