import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { tasksAPI, usersAPI } from '../services/api';
import {
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    User,
    Calendar,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    CheckCheck,
    Lock
} from 'lucide-react';

export default function Tasks() {
    const { user, isManager, isSpecialist } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [specialists, setSpecialists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [actionMenuTask, setActionMenuTask] = useState(null);


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM'
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksRes, specialistsRes] = await Promise.all([
                tasksAPI.getAll(),
                isManager() ? usersAPI.getSpecialists() : Promise.resolve({ data: [] })
            ]);
            setTasks(tasksRes.data);
            setSpecialists(specialistsRes.data);
        } catch (error) {
            console.error('Eroare la încărcarea datelor:', error);
        } finally {
            setLoading(false);
        }
    };


    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });


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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-400';
            case 'MEDIUM': return 'text-amber-400';
            case 'LOW': return 'text-green-400';
            default: return 'text-slate-400';
        }
    };


    const handleCreateTask = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await tasksAPI.create(formData);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', priority: 'MEDIUM' });
            loadData();
        } catch (error) {
            setFormError(error.response?.data?.error || 'Eroare la creare');
        } finally {
            setFormLoading(false);
        }
    };

    const handleAssign = async (specialistId) => {
        try {
            await tasksAPI.assign(selectedTask.id, specialistId);
            setShowAssignModal(false);
            setSelectedTask(null);
            loadData();
        } catch (error) {
            console.error('Eroare la alocare:', error);
        }
    };

    const handleComplete = async (taskId) => {
        try {
            await tasksAPI.complete(taskId);
            setActionMenuTask(null);
            loadData();
        } catch (error) {
            console.error('Eroare:', error);
        }
    };

    const handleClose = async (taskId) => {
        try {
            await tasksAPI.close(taskId);
            setActionMenuTask(null);
            loadData();
        } catch (error) {
            console.error('Eroare:', error);
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Sigur vrei să ștergi acest task?')) return;
        try {
            await tasksAPI.delete(taskId);
            setActionMenuTask(null);
            loadData();
        } catch (error) {
            console.error('Eroare la ștergere:', error);
        }
    };

    const openAssignModal = (task) => {
        setSelectedTask(task);
        setShowAssignModal(true);
        setActionMenuTask(null);
    };


    const statusCounts = {
        ALL: tasks.length,
        OPEN: tasks.filter(t => t.status === 'OPEN').length,
        PENDING: tasks.filter(t => t.status === 'PENDING').length,
        COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
        CLOSED: tasks.filter(t => t.status === 'CLOSED').length,
    };

    return (
        <Layout>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Task-uri</h1>
                    <p className="text-slate-400 text-sm">
                        {isSpecialist() ? 'Task-urile tale' : 'Gestionează toate task-urile'}
                    </p>
                </div>

                {isManager() && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Task nou</span>
                    </button>
                )}
            </div>


            <div className="flex flex-col lg:flex-row gap-4 mb-6">

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Caută task-uri..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>


                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {['ALL', 'OPEN', 'PENDING', 'COMPLETED', 'CLOSED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${statusFilter === status
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <span>{status === 'ALL' ? 'Toate' : getStatusLabel(status)}</span>
                            <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded-full">
                                {statusCounts[status]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>


            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
                    <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nu există task-uri</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => {
                        const StatusIcon = getStatusIcon(task.status);
                        return (
                            <div
                                key={task.id}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">

                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
                                            {task.priority && (
                                                <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </div>


                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>


                                        <div className="flex flex-wrap items-center gap-4 text-sm">

                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {getStatusLabel(task.status)}
                                            </span>


                                            {task.createdBy && (
                                                <span className="flex items-center gap-1.5 text-slate-400">
                                                    <User className="w-4 h-4" />
                                                    {task.createdBy.name}
                                                </span>
                                            )}


                                            {task.assignedTo && (
                                                <span className="flex items-center gap-1.5 text-slate-300">
                                                    <UserPlus className="w-4 h-4" />
                                                    {task.assignedTo.name}
                                                </span>
                                            )}


                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(task.createdAt).toLocaleDateString('ro-RO')}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="relative">
                                        <button
                                            onClick={() => setActionMenuTask(actionMenuTask === task.id ? null : task.id)}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>


                                        {actionMenuTask === task.id && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">

                                                {isManager() && task.status === 'OPEN' && (
                                                    <button
                                                        onClick={() => openAssignModal(task)}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                        Alocă
                                                    </button>
                                                )}


                                                {isSpecialist() && task.status === 'PENDING' && task.assignedToId === user.id && (
                                                    <button
                                                        onClick={() => handleComplete(task.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-emerald-400 hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <CheckCheck className="w-4 h-4" />
                                                        Marchează completat
                                                    </button>
                                                )}


                                                {isManager() && task.status === 'COMPLETED' && (
                                                    <button
                                                        onClick={() => handleClose(task.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-blue-400 hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <Lock className="w-4 h-4" />
                                                        Închide task
                                                    </button>
                                                )}


                                                {isManager() && (
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Șterge
                                                    </button>
                                                )}


                                                {!isManager() && !(isSpecialist() && task.status === 'PENDING' && task.assignedToId === user.id) && (
                                                    <div className="px-4 py-3 text-slate-500 text-sm">
                                                        Nicio acțiune disponibilă
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-xl">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Task nou</h2>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Titlu</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Configurare laptop"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Descriere</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={4}
                                    placeholder="Descriere detaliată a task-ului..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Prioritate</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="LOW">Scazuta</option>
                                    <option value="MEDIUM">Medie</option>
                                    <option value="HIGH">Ridicata</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all"
                                >
                                    Anulează
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                                >
                                    {formLoading ? 'Se creează...' : 'Creează task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {showAssignModal && selectedTask && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-xl">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Alocă task</h2>
                            <p className="text-slate-400 text-sm mt-1">{selectedTask.title}</p>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-300 mb-4">Selectează un specialist:</p>

                            {specialists.length === 0 ? (
                                <p className="text-slate-500">Nu există specialiști disponibili</p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {specialists.map((specialist) => (
                                        <button
                                            key={specialist.id}
                                            onClick={() => handleAssign(specialist.id)}
                                            className="w-full flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {specialist.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{specialist.name}</p>
                                                <p className="text-slate-400 text-sm">{specialist.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => { setShowAssignModal(false); setSelectedTask(null); }}
                                className="w-full mt-4 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all"
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {actionMenuTask && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActionMenuTask(null)}
                />
            )}
        </Layout>
    );
}
