import Link from "next/link";
import { Brain, Phone, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary mb-3">
              <Brain className="h-5 w-5" />
              <span>MenteSã</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Cuidando da saúde mental com excelência e acolhimento desde 2010.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link href="/medicos" className="hover:text-primary transition-colors">Nossos Médicos</Link></li>
              <li><Link href="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Área do Paciente</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(11) 3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contato@mentesa.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          © 2025 MenteSã Clínica Psiquiátrica. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
