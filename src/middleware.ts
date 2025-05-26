// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(request) {
        const { pathname } = request.nextUrl;
        const token = request.nextauth.token;

        // Block access to protected routes if not authenticated
        if (
            (pathname.startsWith('/admin') && token?.role !== 'admin' ||
                (pathname.startsWith('/manager') && token?.role !== 'manager' ||
                    (pathname.startsWith('/staff') && token?.role !== 'staff')
                ))) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirect authenticated users away from login
        if (pathname === '/login' && token) {
            return NextResponse.redirect(new URL(`/${token.role}`, request.url));
        }
    },
    {
        callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            authorized: ({ token }) => {
                // The root route ('/') is always accessible
                return true;
            },
        },
    }
);

export const config = {
    matcher: ['/admin/:path*', '/manager/:path*', '/staff/:path*', '/login'],
};










// // middleware.ts
// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';
// import type { NextRequestWithAuth } from 'next-auth/middleware';
// export default withAuth(
//     function middleware(request: NextRequestWithAuth) {
//         const { pathname, origin } = request.nextUrl;
//         const { token } = request.nextauth;

//         // Redirect to role-specific routes if trying to access root
//         if (pathname === '/') {
//             return NextResponse.redirect(`${origin}/${token?.role}`);
//         }

//         // Role-based route protection
//         if (pathname.startsWith('/admin') && token?.role !== 'admin') {
//             return NextResponse.redirect(origin);
//         }
//         if (pathname.startsWith('/manager') && token?.role !== 'manager') {
//             return NextResponse.redirect(origin);
//         }
//         if (pathname.startsWith('/staff') && token?.role !== 'staff') {
//             return NextResponse.redirect(origin);
//         }

//         return NextResponse.next();
//     },
//     {
//         callbacks: {
//             authorized: ({ token }) => !!token,
//         },
//     }
// );

// export const config = {
//     matcher: ['/', '/admin/:path*', '/manager/:path*', '/staff/:path*'],
// };