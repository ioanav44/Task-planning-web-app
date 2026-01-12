import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { usersAPI } from '../services/api';
import {
    Plus,
    Search,
    User,
    Mail,
    Shield,
    Trash2,
    Edit,
    MoreVertical,
    UserPlus,
    AlertCircle,
    X
} from 'lucide-react';

export default function Users() {
    const { user: currentUser, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionMenuUser, setActionMenuUser] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'IT_SPECIALIST',
        managerId: ''
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data);

            setManagers(response.data.filter(u => u.role === 'IT_MANAGER'));
        } catch (error) {
            console.error('Eroare la încărcarea datelor:', error);
        } finally {
            setLoading(false);
        }
    };


    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMINISTRATOR': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'IT_MANAGER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'IT_SPECIALIST': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ADMINISTRATOR': return 'Administrator';
            case 'IT_MANAGER': return 'IT Manager';
            case 'IT_SPECIALIST': return 'IT Specialist';
            default: return role;
        }
    };

    const getRoleGradient = (role) => {
        switch (role) {
            case 'ADMINISTRATOR': return 'from-purple-500 to-pink-600';
            case 'IT_MANAGER': return 'from-blue-500 to-cyan-600';
            case 'IT_SPECIALIST': return 'from-emerald-500 to-teal-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };


    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await usersAPI.create({
                ...formData,
                managerId: formData.managerId || undefined
            });
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '', role: 'IT_SPECIALIST', managerId: '' });
            loadData();
        } catch (error) {
            setFormError(error.response?.data?.error || 'Eroare la creare');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await usersAPI.update(selectedUser.id, {
                name: formData.name,
                role: formData.role,
                managerId: formData.managerId || null
            });
            setShowEditModal(false);
            setSelectedUser(null);
            loadData();
        } catch (error) {
            setFormError(error.response?.data?.error || 'Eroare la editare');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (userId === currentUser.id) {
            alert('Nu te poți șterge pe tine însuți!');
            return;
        }
        if (!confirm('Sigur vrei să ștergi acest utilizator?')) return;

        try {
            await usersAPI.delete(userId);
            setActionMenuUser(null);
            loadData();
        } catch (error) {
            console.error('Eroare la ștergere:', error);
            alert('Eroare la ștergere. Utilizatorul poate avea task-uri asociate.');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            managerId: user.managerId || ''
        });
        setShowEditModal(true);
        setActionMenuUser(null);
    };


    const roleCounts = {
        ALL: users.length,
        ADMINISTRATOR: users.filter(u => u.role === 'ADMINISTRATOR').length,
        IT_MANAGER: users.filter(u => u.role === 'IT_MANAGER').length,
        IT_SPECIALIST: users.filter(u => u.role === 'IT_SPECIALIST').length,
    };

    if (!isAdmin()) {
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Utilizatori</h1>
                    <p className="text-slate-400 text-sm">Gestionează conturile utilizatorilor</p>
                </div>

                <button
                    onClick={() => {
                        setFormData({ name: '', email: '', password: '', role: 'IT_SPECIALIST', managerId: '' });
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Utilizator nou</span>
                </button>
            </div>


            <div className="flex flex-col lg:flex-row gap-4 mb-6">

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Caută utilizatori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>


                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {['ALL', 'ADMINISTRATOR', 'IT_MANAGER', 'IT_SPECIALIST'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${roleFilter === role
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <span>{role === 'ALL' ? 'Toți' : getRoleLabel(role)}</span>
                            <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded-full">
                                {roleCounts[role]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>


            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700/50">
                    <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nu există utilizatori</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${getRoleGradient(user.role)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{user.name}</h3>
                                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </div>
                                </div>


                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActionMenuUser(actionMenuUser === user.id ? null : user.id);
                                        }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {actionMenuUser === user.id && (
                                        <>

                                            <div
                                                className="fixed inset-0"
                                                onClick={() => setActionMenuUser(null)}
                                            />

                                            <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editează
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Șterge
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>


                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.manager && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Shield className="w-4 h-4" />
                                        <span>Manager: {user.manager.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Utilizator nou</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Nume</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Parolă</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="IT_SPECIALIST">IT Specialist</option>
                                    <option value="IT_MANAGER">IT Manager</option>
                                    <option value="ADMINISTRATOR">Administrator</option>
                                </select>
                            </div>

                            {formData.role === 'IT_SPECIALIST' && managers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Manager (opțional)</label>
                                    <select
                                        value={formData.managerId}
                                        onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Fără manager</option>
                                        {managers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

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
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50"
                                >
                                    {formLoading ? 'Se creează...' : 'Creează'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Editează utilizator</h2>
                            <button onClick={() => { setShowEditModal(false); setSelectedUser(null); }} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEdit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Nume</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-slate-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email-ul nu poate fi modificat</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="IT_SPECIALIST">IT Specialist</option>
                                    <option value="IT_MANAGER">IT Manager</option>
                                    <option value="ADMINISTRATOR">Administrator</option>
                                </select>
                            </div>

                            {formData.role === 'IT_SPECIALIST' && managers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Manager</label>
                                    <select
                                        value={formData.managerId}
                                        onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Fără manager</option>
                                        {managers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                                    className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all"
                                >
                                    Anulează
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl transition-all disabled:opacity-50"
                                >
                                    {formLoading ? 'Se salvează...' : 'Salvează'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
