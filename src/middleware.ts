import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // MODO LIMPIEZA DE SESION
    if (url.searchParams.get('clear_session') === 'true') {
        url.searchParams.delete('clear_session');
        const response = NextResponse.redirect(url);
        response.cookies.delete('session');
        return response;
    }

    // AUTH LAYER
    const sessionCookie = request.cookies.get('session');
    const isAuthRoute = ['/login', '/registro'].some(route => url.pathname.startsWith(route));
    const isAppRoute = url.pathname.startsWith('/mobile') || url.pathname.startsWith('/desktop');

    // Protect internal app routes
    if (isAppRoute && !sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect logged users away from auth pages
    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow Next.js router and NextConfig rewrites to handle the rest
    return NextResponse.next();
}

// Configurar en qué rutas se debe ejecutar este middleware
export const config = {
    matcher: [
        /*
         * Correr middleware en todo excepto:
         * - api (rutas de API)
         * - _next/static (archivos estáticos compilados)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (icono global)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
