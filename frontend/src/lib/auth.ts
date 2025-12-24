/**
 * Authentication helpers
 * Prepared for Supabase integration
 */

// Simulated auth state (replace with Supabase in production)
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'AUDITOR' | 'SUPERVISOR' | 'VIEWER';
    companyId: string;
    companyName: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Token management
export const auth = {
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    },

    setToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('token', token);
    },

    removeToken: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('token');
    },

    // Mock login (replace with Supabase)
    login: async (email: string, password: string): Promise<User> => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation
        if (!email.includes('@') || password.length < 6) {
            throw new Error('Credenciales inválidas');
        }

        const mockUser: User = {
            id: 'user_123',
            email,
            name: 'Juan Pérez',
            role: 'AUDITOR',
            companyId: 'company_123',
            companyName: 'Minera Los Andes',
        };

        // Generate mock token
        const mockToken = btoa(JSON.stringify({ userId: mockUser.id, exp: Date.now() + 86400000 }));
        auth.setToken(mockToken);

        return mockUser;
    },

    logout: async (): Promise<void> => {
        auth.removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    getCurrentUser: async (): Promise<User | null> => {
        const token = auth.getToken();
        if (!token) return null;

        try {
            // In production, validate token with backend or Supabase
            const decoded = JSON.parse(atob(token));
            if (decoded.exp < Date.now()) {
                auth.removeToken();
                return null;
            }

            // Return mock user
            return {
                id: 'user_123',
                email: 'auditor@empresa.cl',
                name: 'Juan Pérez',
                role: 'AUDITOR',
                companyId: 'company_123',
                companyName: 'Minera Los Andes',
            };
        } catch {
            auth.removeToken();
            return null;
        }
    },

    isAuthenticated: (): boolean => {
        const token = auth.getToken();
        if (!token) return false;

        try {
            const decoded = JSON.parse(atob(token));
            return decoded.exp > Date.now();
        } catch {
            return false;
        }
    },
};

// Role-based access control
export const rbac = {
    canCreateAudit: (role: User['role']): boolean => {
        return ['ADMIN', 'AUDITOR', 'SUPERVISOR'].includes(role);
    },

    canApproveNC: (role: User['role']): boolean => {
        return ['ADMIN', 'SUPERVISOR'].includes(role);
    },

    canViewAllCompanies: (role: User['role']): boolean => {
        return role === 'ADMIN';
    },

    canManageUsers: (role: User['role']): boolean => {
        return role === 'ADMIN';
    },

    canExportReports: (role: User['role']): boolean => {
        return ['ADMIN', 'AUDITOR', 'SUPERVISOR'].includes(role);
    },
};
