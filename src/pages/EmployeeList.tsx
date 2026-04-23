import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, FileText, User, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function EmployeeList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);

    // Employee State
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get('/employee');
                setEmployees(res.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error('Failed to load employees');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        location: '',
        status: 'Active'
    });

    // Filter Logic
    const filteredEmployees = employees.filter(emp => {
        const profile = emp.employeeProfile || {};
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (profile.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const status = profile.status || 'Active';
        const matchesStatus = filterStatus === 'All' || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewProfile = (id: number) => {
        navigate(`/employee/${id}`);
    };

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        const id = employees.length + 1;
        // Mock Avatar assignment
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
        const avatar = colors[Math.floor(Math.random() * colors.length)];

        const addedEmployee = { id, ...newEmployee, avatar };
        setEmployees([addedEmployee, ...employees]);
        setShowAddModal(false);
        setNewEmployee({
            name: '',
            email: '',
            phone: '',
            role: '',
            department: '',
            location: '',
            status: 'Active'
        });
        toast.success('Employee Added Successfully!');
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employees</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your organization's workforce</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                        <FileText size={18} />
                        <span className="hidden md:inline">Export</span>
                    </button>
                    <button
                        onClick={() => navigate('/employee/add')}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 active:scale-95 transition-all shadow-lg shadow-brand-500/20"
                    >
                        <Plus size={18} />
                        <span>Add Employee</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-brand-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-800 dark:text-white"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Grid/List View */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-brand-900 rounded-3xl border border-gray-100 dark:border-white/5">
                    <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Fetching workforce data...</p>
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-brand-900 rounded-3xl border border-gray-100 dark:border-white/5">
                    <User size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">No Employees Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEmployees.map((emp, index) => {
                        const profile = emp.employeeProfile || {};
                        const status = profile.status || 'Active';
                        // Generate color based on index or name hash
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
                        const avatarColor = colors[index % colors.length];

                        return (
                            <div key={emp.id} className="bg-white dark:bg-brand-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                {/* Status Stripe */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${avatarColor}`}>
                                                {emp.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{emp.name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.title || 'Employee'}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} className="text-gray-400" />
                                            {profile.location || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail size={16} className="text-gray-400" />
                                            {emp.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <Phone size={16} className="text-gray-400" />
                                            {profile.phone || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status === 'Active'
                                            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                            }`}>
                                            {status}
                                        </span>

                                        {status === 'Inactive' ? (
                                            <button className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline">
                                                Process F&F
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleViewProfile(emp.id)}
                                                className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline flex items-center gap-1"
                                            >
                                                View Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add New Employee</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <User size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmployee.name}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Role / Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmployee.role}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newEmployee.phone}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                    <select
                                        value={newEmployee.department}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                    >
                                        <option value="">Select Dept</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Product">Product</option>
                                        <option value="Sales">Sales</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                                <input
                                    type="text"
                                    value={newEmployee.location}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                                    placeholder="e.g. Delhi HQ"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all"
                                >
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
