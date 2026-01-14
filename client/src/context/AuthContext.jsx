/*
 * Context pentru autentificare
 * Gestioneaza starea userului logat in toata aplicatia
 * Folosit cu useAuth() in componente
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';


// cream contextul
const AuthContext = createContext(null);


// Provider-ul care inconjoara toata aplicatia
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // la incarcarea paginii verificam daca avem token salvat
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);


    // functie pt login - trimite datele la backend si salveaza tokenul
    const login = async (email, password) => {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;

        // salvam in localStorage ca sa ramana logat dupa refresh
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };


    // register - la fel ca login doar ca creeaza cont
    const register = async (data) => {
        const response = await authAPI.register(data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };


    // logout - stergem tot din localStorage
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };


    // helper pt verificare rol
    const hasRole = (role) => {
        return user?.role === role;
    };

    // scurtaturi pt fiecare rol
    const isAdmin = () => hasRole('ADMINISTRATOR');
    const isManager = () => hasRole('IT_MANAGER');
    const isSpecialist = () => hasRole('IT_SPECIALIST');

    // valorile expuse in context
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
        isAuthenticated: !!user,  // true daca user exista
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


// hook custom pt a folosi contextul
// asa nu trebuie sa importam AuthContext direct
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
