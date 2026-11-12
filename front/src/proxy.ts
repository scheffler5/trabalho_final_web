import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES = [
  { prefix: "/dashboard", roles: ["patient"] },
  { prefix: "/medico",    roles: ["doctor"]  },
  { prefix: "/admin",     roles: ["admin"]   },
];

const PUBLIC_EXCEPTIONS  = ["/admin/registro"];
const AUTH_ONLY_ROUTES   = ["/login", "/cadastro"];

function decodeRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role ?? null;
  } catch { return null; }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_EXCEPTIONS.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  // Lê JWT do cookie (setado pelo frontend após login)
  const token    = request.cookies.get("clinica_auth")?.value ?? null;
  const userRole = token ? decodeRole(token) : null;

  const protected_ = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (protected_) {
    if (!userRole) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (!protected_.roles.includes(userRole)) {
      const home = userRole === "admin" ? "/admin"
                 : userRole === "doctor" ? "/medico" : "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  if (userRole && AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    const home = userRole === "admin" ? "/admin"
               : userRole === "doctor" ? "/medico" : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/medico/:path*", "/admin/:path*",
    "/login", "/cadastro", "/cadastro/:path*",
  ],
};
