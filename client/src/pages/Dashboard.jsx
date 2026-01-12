import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { tasksAPI } from '../services/api';
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export default function Dashboard() {
    const { user, isManager, isSpecialist } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        pending: 0,
        completed: 0,
        closed: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await tasksAPI.getAll();
            const tasks = response.data;


            setStats({
                total: tasks.length,
                open: tasks.filter(t => t.status === 'OPEN').length,
                pending: tasks.filter(t => t.status === 'PENDING').length,
                completed: tasks.filter(t => t.status === 'COMPLETED').length,
                closed: tasks.filter(t => t.status === 'CLOSED').length,
            });


            setRecentTasks(tasks.slice(0, 5));
        } catch (error) {
            console.error('Eroare la încărcarea datelor:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'PENDING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'CLOSED': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'OPEN': return 'Deschis';
            case 'PENDING': return 'În lucru';
            case 'COMPLETED': return 'Completat';
            case 'CLOSED': return 'Închis';
            default: return status;
        }
    };

    const statCards = [
        { label: 'Total Task-uri', value: stats.total, icon: ClipboardList, color: 'from-blue-500 to-cyan-500' },
        { label: 'Deschise', value: stats.open, icon: AlertCircle, color: 'from-blue-400 to-blue-600' },
        { label: 'În lucru', value: stats.pending, icon: Clock, color: 'from-amber-400 to-orange-500' },
        { label: 'Completate', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-400 to-green-500' },
    ];

    return (
        <Layout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Bine ai venit, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-slate-400">
                    Iată o privire de ansamblu asupra task-urilor tale
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <card.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-slate-500" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                                <p className="text-slate-400 text-sm">{card.label}</p>
                            </div>
                        ))}
                    </div>


                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
                        <div className="p-6 border-b border-slate-700/50">
                            <h2 className="text-xl font-semibold text-white">Task-uri recente</h2>
                        </div>

                        {recentTasks.length === 0 ? (
                            <div className="p-12 text-center">
                                <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">Nu există task-uri încă</p>
                                {isManager() && (
                                    <p className="text-slate-500 text-sm mt-2">
                                        Creează primul task din pagina "Task-uri"
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700/50">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-4 hover:bg-slate-700/20 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">{task.title}</h3>
                                                <p className="text-slate-400 text-sm truncate">{task.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                {task.assignedTo && (
                                                    <span className="text-slate-400 text-sm hidden sm:block">
                                                        → {task.assignedTo.name}
                                                    </span>
                                                )}
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                                                    {getStatusLabel(task.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}
