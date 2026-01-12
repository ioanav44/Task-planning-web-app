import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);


    const login = async (email, password) => {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };


    const register = async (data) => {
        const response = await authAPI.register(data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };


    const hasRole = (role) => {
        return user?.role === role;
    };


    const isAdmin = () => hasRole('ADMINISTRATOR');


    const isManager = () => hasRole('IT_MANAGER');


    const isSpecialist = () => hasRole('IT_SPECIALIST');

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        isManager,
        isSpecialist,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
