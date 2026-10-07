"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Menu, X, Stethoscope, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/",        label: "Início"  },
  { href: "/medicos", label: "Médicos" },
  { href: "/sobre",   label: "Sobre"   },
];

function roleConfig(role: string) {
  if (role === "admin")  return { href: "/admin",    label: "Painel Admin",  icon: ShieldCheck, badge: "Admin",  color: "bg-orange-100 text-orange-700" };
  if (role === "doctor") return { href: "/medico",   label: "Meu Painel",    icon: Stethoscope, badge: "Médico", color: "bg-purple-100 text-purple-700" };
  return                        { href: "/dashboard", label: "Minha Área",   icon: User,        badge: "Paciente", color: "bg-blue-100 text-blue-700" };
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname         = usePathname();
  const [open, setOpen]  = useState(false);
  const rc = user ? roleConfig(user.role) : null;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Brain className="h-6 w-6" />
          <span className="text-lg">MenteSã</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {publicLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === l.href ? "text-primary" : "text-muted-foreground"
              )}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user && rc ? (
            <>
              <Badge variant="outline" className={cn("text-xs", rc.color)}>
                {rc.badge}
              </Badge>
              <Link href={rc.href}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <rc.icon className="h-4 w-4" />
                  {rc.label}
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={logout}>Sair</Button>
            </>
          ) : (
            <>
              <Link href="/cadastro">
                <Button size="sm" variant="ghost">Cadastrar</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Entrar</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {publicLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary p-2 rounded",
                    pathname === l.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}>
                  {l.label}
                </Link>
              ))}
              <div className="border-t pt-4 flex flex-col gap-2">
                {user && rc ? (
                  <>
                    <Badge variant="outline" className={cn("text-xs w-fit", rc.color)}>
                      {rc.badge}
                    </Badge>
                    <Link href={rc.href} onClick={() => setOpen(false)}>
                      <Button className="w-full" variant="outline">{rc.label}</Button>
                    </Link>
                    <Button className="w-full" variant="ghost"
                      onClick={() => { logout(); setOpen(false); }}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/cadastro" onClick={() => setOpen(false)}>
                      <Button className="w-full mb-1" variant="outline">Cadastrar</Button>
                    </Link>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button className="w-full">Entrar</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
