import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
    const { user, logout, isAdmin, isManager, isSpecialist } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    const getRoleColor = () => {
        if (isAdmin()) return 'from-purple-500 to-pink-600';
        if (isManager()) return 'from-blue-500 to-cyan-600';
        return 'from-emerald-500 to-teal-600';
    };

    const getRoleName = () => {
        if (isAdmin()) return 'Administrator';
        if (isManager()) return 'IT Manager';
        return 'IT Specialist';
    };


    const menuItems = [
        {
            path: '/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
            roles: ['ADMINISTRATOR', 'IT_MANAGER', 'IT_SPECIALIST']
        },
        {
            path: '/tasks',
            icon: ClipboardList,
            label: 'Task-uri',
            roles: ['ADMINISTRATOR', 'IT_MANAGER', 'IT_SPECIALIST']
        },
        {
            path: '/users',
            icon: Users,
            label: 'Utilizatori',
            roles: ['ADMINISTRATOR'] // Doar admin
        },
        {
            path: '/team',
            icon: Users,
            label: 'Echipa mea',
            roles: ['IT_MANAGER'] // Doar manageri
        },
    ];


    const visibleMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">

                    <div className="p-6 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor()} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <ClipboardList className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">Task Manager</h1>
                                    <p className="text-xs text-slate-400">Echipa 404found</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>


                    <nav className="flex-1 p-4 space-y-2">
                        {visibleMenuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                                        ? `bg-gradient-to-r ${getRoleColor()} text-white shadow-lg`
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                            </NavLink>
                        ))}
                    </nav>


                    <div className="p-4 border-t border-slate-700/50">
                        <div className="bg-slate-700/30 rounded-xl p-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center text-white font-bold`}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-400">{getRoleName()}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Deconectare</span>
                        </button>
                    </div>
                </div>
            </aside>


            <div className="flex-1 flex flex-col min-h-screen">

                <header className="lg:hidden bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-slate-300 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="text-white font-medium">Task Manager</span>
                        <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>


                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
