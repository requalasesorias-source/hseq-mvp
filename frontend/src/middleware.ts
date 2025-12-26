
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Rutas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/audit', '/reports', '/nonconformities', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Verificar si el usuario tiene el token (MVP Simulation)
    const hasAuthToken = request.cookies.has('auth_token');

    // Si intenta acceder a ruta protegida sin token -> Login
    if (isProtectedRoute && !hasAuthToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Si ya tiene token e intenta ir a Login o Root -> Dashboard
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') && hasAuthToken) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // Si está en Root y NO tiene token -> Login (Landing page es Login ahora)
    if (request.nextUrl.pathname === '/' && !hasAuthToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
