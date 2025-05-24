// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const { pathname, origin } = req.nextUrl;
        const { token } = req.nextauth;
        console.log('Origin', origin)
        console.log('Token', token)
        // Redirect to role-specific routes if trying to access root
        if (pathname === '/') {
            return NextResponse.redirect(`${origin}/${token?.role}`);
        }

        // Role-based route protection
        if (pathname.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(origin);
        }
        if (pathname.startsWith('/manager') && token?.role !== 'manager') {
            return NextResponse.redirect(origin);
        }
        if (pathname.startsWith('/staff') && token?.role !== 'staff') {
            return NextResponse.redirect(origin);
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ['/', '/admin/:path*', '/manager/:path*', '/staff/:path*'],
};