import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const rolePermissions: Record<string, string[]> = {
  '/admin': ['admin'],
  '/manager': ['manager', 'admin'],
  '/staff': ['staff', 'manager', 'admin'],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const user = await getCurrentUser();

  // Check route permissions
  for (const [routePath, allowedRoles] of Object.entries(rolePermissions)) {
    if (path.startsWith(routePath)) {
      if (!user || !allowedRoles.includes(user.role)) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/manager/:path*', '/staff/:path*'],
};