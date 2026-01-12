import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { usersAPI, tasksAPI } from '../services/api';
import {
    Users,
    User,
    Mail,
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertCircle,
    Lock,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function Team() {
    const { isManager } = useAuth();
    const [specialists, setSpecialists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userTasks, setUserTasks] = useState({});
    const [loadingTasks, setLoadingTasks] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await usersAPI.getSpecialists();
            setSpecialists(response.data);
        } catch (error) {
            console.error('Eroare la încărcarea datelor:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserTasks = async (userId) => {

        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }

        setExpandedUser(userId);


        if (!userTasks[userId]) {
            setLoadingTasks(userId);
            try {
                const response = await tasksAPI.getHistory(userId);
                setUserTasks(prev => ({ ...prev, [userId]: response.data }));
            } catch (error) {
                console.error('Eroare la încărcarea istoricului:', error);
            } finally {
                setLoadingTasks(null);
            }
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'OPEN': return AlertCircle;
            case 'PENDING': return Clock;
            case 'COMPLETED': return CheckCircle2;
            case 'CLOSED': return Lock;
            default: return AlertCircle;
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

    const getTaskStats = (tasks) => {
        if (!tasks) return { total: 0, pending: 0, completed: 0 };
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'PENDING').length,
            completed: tasks.filter(t => t.status === 'COMPLETED' || t.status === 'CLOSED').length
        };
    };

    if (!isManager()) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400">Nu ai acces la această pagină</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Echipa mea</h1>
                <p className="text-slate-400 text-sm">Specialiștii și istoricul task-urilor lor</p>
            </div>


            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : specialists.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nu există specialiști</p>
                    <p className="text-slate-500 text-sm mt-2">
                        Cere administratorului să creeze conturi de specialist
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {specialists.map((specialist) => {
                        const isExpanded = expandedUser === specialist.id;
                        const tasks = userTasks[specialist.id] || [];
                        const stats = getTaskStats(tasks);

                        return (
                            <div
                                key={specialist.id}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
                            >

                                <button
                                    onClick={() => loadUserTasks(specialist.id)}
                                    className="w-full p-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {specialist.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-white font-semibold">{specialist.name}</h3>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Mail className="w-4 h-4" />
                                                <span>{specialist.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">

                                        {userTasks[specialist.id] && (
                                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                                <span className="flex items-center gap-1 text-slate-400">
                                                    <ClipboardList className="w-4 h-4" />
                                                    {stats.total} total
                                                </span>
                                                <span className="flex items-center gap-1 text-amber-400">
                                                    <Clock className="w-4 h-4" />
                                                    {stats.pending} activ
                                                </span>
                                                <span className="flex items-center gap-1 text-emerald-400">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    {stats.completed} finalizat
                                                </span>
                                            </div>
                                        )}

                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </button>


                                {isExpanded && (
                                    <div className="border-t border-slate-700/50 p-5 bg-slate-800/30">
                                        {loadingTasks === specialist.id ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                                            </div>
                                        ) : tasks.length === 0 ? (
                                            <div className="text-center py-8">
                                                <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                                <p className="text-slate-500">Niciun task în istoric</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <h4 className="text-slate-300 font-medium mb-4">Istoric task-uri ({tasks.length})</h4>
                                                {tasks.map((task) => {
                                                    const StatusIcon = getStatusIcon(task.status);
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="text-white font-medium truncate">{task.title}</h5>
                                                                <p className="text-slate-400 text-sm truncate">{task.description}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3 ml-4">
                                                                <span className="text-slate-500 text-xs hidden sm:block">
                                                                    {new Date(task.createdAt).toLocaleDateString('ro-RO')}
                                                                </span>
                                                                <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    {getStatusLabel(task.status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
}
