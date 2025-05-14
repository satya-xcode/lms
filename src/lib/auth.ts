import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function createSession(user: { id: string; email: string; role: UserRole }) {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
    });
}

export async function destroySession() {
    cookies().delete('session');
}

export async function getCurrentUser() {
    const session = cookies().get('session')?.value;
    if (!session) return null;

    try {
        const decoded = jwt.verify(session, JWT_SECRET) as jwt.JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function requireAuth(requiredRole?: UserRole) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthenticated');

    if (requiredRole && user.role !== requiredRole) {
        throw new Error('Unauthorized');
    }

    return user;
}