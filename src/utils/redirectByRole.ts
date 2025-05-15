// utils/redirectByRole.ts
export function getRedirectPathByRole(role: string) {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'manager':
            return '/manager';
        case 'staff':
            return '/staff';
        default:
            return '/';
    }
}
