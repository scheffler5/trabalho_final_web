import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

type CookiePayload = { id: string; role: string };

function parseCookiePayload(raw: string): CookiePayload | null {
  try {
    return JSON.parse(decodeURIComponent(raw)) as CookiePayload;
  } catch {
    return null;
  }
}

// Rotas protegidas e os papéis que podem acessá-las
const ROLE_ROUTES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/dashboard", roles: ["patient"] },
  { prefix: "/medico",    roles: ["doctor"]  },
  { prefix: "/admin",     roles: ["admin"]   },
];

// Rotas que ficam dentro de prefixos protegidos mas são públicas
const PUBLIC_EXCEPTIONS = ["/admin/registro"];

// Rotas que redirecionam autenticados para sua área
const AUTH_ONLY_ROUTES = ["/login", "/cadastro"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exceções públicas dentro de prefixos protegidos
  if (PUBLIC_EXCEPTIONS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const rawCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload   = rawCookie ? parseCookiePayload(rawCookie) : null;
  const userRole  = payload?.role ?? null;
  const isAuthenticated = !!payload;

  // ── Verifica rotas com restrição de papel ────────────────────────────
  const protected_ = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));

  if (protected_) {
    if (!isAuthenticated) {
      // Não autenticado → redireciona para login com destino salvo
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole && !protected_.roles.includes(userRole)) {
      // Autenticado mas papel errado → redireciona para a área correta
      const home =
        userRole === "admin"  ? "/admin"     :
        userRole === "doctor" ? "/medico"    : "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // ── Autenticado tentando acessar login/cadastro ──────────────────────
  if (isAuthenticated && AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    const home =
      userRole === "admin"  ? "/admin"     :
      userRole === "doctor" ? "/medico"    : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/medico/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro",
    "/cadastro/:path*",
  ],
};
