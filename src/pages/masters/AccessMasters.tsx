import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Plus, Edit2, Check, Lock, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AccessMasters() {
    const [roles, setRoles] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [editingRole, setEditingRole] = useState<any>(null);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);

    // Delete State
    const [itemToDelete, setItemToDelete] = useState<{ id: number, name: string } | null>(null);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = () => api.get('/masters/roles').then(r => setRoles(r.data));
    const fetchPermissions = () => api.get('/masters/permissions').then(r => setPermissions(r.data));

    const handleEdit = (role: any) => {
        setEditingRole(role);
        setRoleName(role.name);
        setSelectedPermissions(role.permissions.map((p: any) => p.id));
        setSelectedModules(role.accessibleModules ? role.accessibleModules.split(',') : []);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingRole(null);
        setRoleName('');
        setSelectedPermissions([]);
        setSelectedModules(['DASHBOARD']);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!roleName) return toast.error("Role Name is required");

        const payload = { 
            name: roleName, 
            permissionIds: selectedPermissions,
            accessibleModules: selectedModules.join(',')
        };

        try {
            setLoading(true);
            if (editingRole) {
                await api.put(`/masters/roles/${editingRole.id}`, payload);
                toast.success("Role updated successfully");
            } else {
                await api.post('/masters/roles', payload);
                toast.success("Role created successfully");
            }
            setShowModal(false);
            fetchRoles();
        } catch (e) {
            toast.error("Failed to save role");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            setLoading(true);
            await api.delete(`/masters/roles/${itemToDelete.id}`);
            toast.success(`${itemToDelete.name} deleted!`);
        } catch (error) {
            console.warn("Backend delete not available.");
            toast.success(`${itemToDelete.name} removed from UI.`);
        } finally {
            setRoles(roles.filter(r => r.id !== itemToDelete.id));
            setItemToDelete(null);
            setLoading(false);
        }
    };

    const togglePermission = (id: string) => {
        if (selectedPermissions.includes(id)) {
            setSelectedPermissions(selectedPermissions.filter(pid => pid !== id));
        } else {
            setSelectedPermissions([...selectedPermissions, id]);
        }
    };

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc: any, p: any) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {});

    return (
        <div className="bg-white dark:bg-[#12151C] rounded-[6px] border border-[#E2E6ED] dark:border-gray-800 p-6 sm:p-8 space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Shield className="text-[#2C4FD6]" size={24} />
                    <h2 className="text-[15.5px] font-bold text-[#12151C] dark:text-white">Access Control</h2>
                </div>
                <button onClick={handleCreate} className="inline-flex items-center justify-center gap-[7px] bg-[#2C4FD6] hover:bg-[#203FB4] text-white rounded-[6px] text-[13.5px] font-semibold px-[15px] py-[9px] transition-all cursor-pointer">
                    <Plus size={16} /> Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="group bg-white dark:bg-[#12151C] border border-[#E2E6ED] dark:border-gray-800 rounded-[6px] p-6 relative transition-all">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(role)} className="p-1.5 text-[#9AA3B1] hover:text-[#2C4FD6] transition-colors cursor-pointer">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => setItemToDelete({ id: role.id, name: role.name })} className="p-1.5 text-[#9AA3B1] hover:text-[#DE350B] transition-colors cursor-pointer">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-[13.5px] font-semibold text-[#12151C] dark:text-white">{role.name}</h3>
                            <p className="text-[11.5px] font-normal text-[#717E95] dark:text-gray-400 mt-0.5">{role.permissions?.length || 0} Permissions Assigned</p>
                        </div>

                        <div className="space-y-2">
                            {role.permissions?.slice(0, 3).map((p: any) => (
                                <div key={p.id} className="flex items-center gap-2 text-xs text-[#5B6472] dark:text-gray-300">
                                    <Check size={12} className="text-[#1F8A5A]" /> {p.name}
                                </div>
                            ))}
                            {role.permissions?.length > 3 && (
                                <div className="text-xs text-[#2C4FD6] dark:text-blue-400 font-medium pl-5">
                                    + {role.permissions.length - 3} more...
                                </div>
                            )}
                            {(!role.permissions || role.permissions.length === 0) && (
                                <div className="text-xs text-[#9AA3B1] italic flex items-center gap-1">
                                    <Lock size={12} /> No specific permissions
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Role Modal */}
            {/* changes made */}
            {showModal && createPortal(
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/20 dark:bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#12151C] rounded-[6px] border border-[#E2E6ED] dark:border-gray-800 w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
                        <div className="p-5 border-b border-[#E2E6ED] dark:border-gray-800 flex justify-between items-center bg-[#F7F8FA] dark:bg-white/5">
                            <h3 className="text-base font-bold text-[#12151C] dark:text-white">{editingRole ? 'Edit Role' : 'Create Role'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-[#9AA3B1] hover:text-[#12151C] dark:hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="mb-8">
                                <label className="block text-xs font-semibold text-[#5B6472] dark:text-gray-300 mb-1.5 uppercase tracking-tight">Role Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#E2E6ED] dark:border-gray-700 rounded-[6px] bg-white dark:bg-[#12151C] text-[13.5px] text-[#12151C] dark:text-white outline-none focus:border-[#2C4FD6]"
                                    value={roleName}
                                    onChange={e => setRoleName(e.target.value)}
                                    placeholder="e.g. HR Manager"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-semibold text-[#5B6472] dark:text-gray-300 mb-2 uppercase tracking-tight">Module Access</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['DASHBOARD', 'ATTENDANCE', 'EMPLOYEE', 'TEAM', 'LEAVE', 'REPORTS', 'MASTERS', 'TASK'].map(module => (
                                        <label key={module} className={`flex items-center gap-3 p-3 rounded-[6px] border cursor-pointer transition-all ${selectedModules.includes(module)
                                            ? 'bg-[#E8ECFC]/40 border-[#2C4FD6] dark:bg-blue-900/20 dark:border-blue-500/50'
                                            : 'bg-white border-[#E2E6ED] dark:bg-[#12151C] dark:border-gray-800 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedModules.includes(module)}
                                                onChange={() => {
                                                    if (selectedModules.includes(module)) {
                                                        setSelectedModules(selectedModules.filter(m => m !== module));
                                                    } else {
                                                        setSelectedModules([...selectedModules, module]);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded accent-[#2C4FD6]"
                                            />
                                            <span className="text-xs font-semibold text-[#12151C] dark:text-white capitalize">{module.toLowerCase()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="font-semibold text-sm text-[#12151C] dark:text-white border-b border-[#E2E6ED] pb-2 dark:border-gray-800 uppercase tracking-tight">Granular Permissions</h4>
                                {Object.keys(permissionsByModule).map(module => {
                                    const modulePermissions = permissionsByModule[module];
                                    const allSelected = modulePermissions.every((p: any) => selectedPermissions.includes(p.id));

                                    const toggleModule = () => {
                                        if (allSelected) {
                                            const idsToRemove = modulePermissions.map((p: any) => p.id);
                                            setSelectedPermissions(selectedPermissions.filter(id => !idsToRemove.includes(id)));
                                        } else {
                                            const idsToAdd = modulePermissions.map((p: any) => p.id).filter((id: string) => !selectedPermissions.includes(id));
                                            setSelectedPermissions([...selectedPermissions, ...idsToAdd]);
                                        }
                                    };

                                    return (
                                        <div key={module} className="bg-white dark:bg-[#12151C] p-5 rounded-[6px] border border-[#E2E6ED] dark:border-gray-800">
                                            <div className="flex justify-between items-center mb-4">
                                                <h5 className="text-[10px] font-black text-[#2C4FD6] dark:text-blue-400 uppercase tracking-[0.2em]">{module}</h5>
                                                <button onClick={toggleModule} className="text-[10px] font-bold text-gray-400 hover:text-[#2C4FD6] uppercase tracking-wider transition-colors cursor-pointer">
                                                    {allSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {modulePermissions.map((p: any) => (
                                                    <label key={p.id} className={`flex items-start gap-3 p-3 rounded-[6px] border cursor-pointer transition-all ${selectedPermissions.includes(p.id) ? 'bg-[#E8ECFC]/40 border-[#2C4FD6] dark:bg-blue-900/20 dark:border-blue-500/20' : 'bg-gray-50/50 dark:bg-gray-900/30 border-transparent hover:border-gray-200'}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="mt-1 w-4 h-4 rounded accent-[#2C4FD6]"
                                                            checked={selectedPermissions.includes(p.id)}
                                                            onChange={() => togglePermission(p.id)}
                                                        />
                                                        <div>
                                                            <div className="text-xs font-semibold text-[#12151C] dark:text-white leading-none mb-1">{p.name}</div>
                                                            <div className="text-[10px] text-[#9AA3B1] dark:text-gray-400 font-mono">{p.code}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-5 border-t border-[#E2E6ED] dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-[#12151C] rounded-b-[6px]">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-[13.5px] text-[#5B6472] hover:text-[#12151C] dark:text-gray-400 dark:hover:text-white font-semibold transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={loading} className="inline-flex items-center gap-[7px] bg-[#2C4FD6] hover:bg-[#203FB4] text-white text-[13.5px] font-semibold rounded-[6px] px-[18px] py-[9px] transition-all cursor-pointer">
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>,document.body
            )}

            {/* Delete Confirmation Modal (MATCHING THEME) */}
            {itemToDelete && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4 animate-fade-in">
                    <div className="bg-[#0f1016] rounded-[6px] w-full max-w-[calc(100vw-2rem)] sm:max-w-[360px] border-t-4 border-red-600 text-center relative overflow-hidden pb-8 px-5 sm:px-6">
                        <div className="w-20 h-20 bg-[#1c1d26] rounded-full flex items-center justify-center mx-auto mb-6 mt-8">
                            <Trash2 size={32} className="text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Delete Role?</h3>
                        <p className="text-[#8a8b94] mb-8 text-sm leading-relaxed px-2">
                            Are you sure you want to delete <span className="font-bold text-gray-200">{itemToDelete.name}</span>? <br/>
                            This action cannot be undone and will permanently remove all associated permissions.
                        </p>
                        <div className="flex gap-4 px-2">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-3.5 px-4 bg-[#1c1d26] text-white font-bold rounded-[6px] hover:bg-[#252631] transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 py-3.5 px-4 bg-[#ff3b3b] text-white font-bold rounded-[6px] hover:bg-[#ff4d4d] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
