import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import { ArrowLeft, User, FileText, CreditCard, Download, Upload, Briefcase, Save, X, Edit, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasPermission } = useRBAC();
    const [activeTab, setActiveTab] = useState<'personal' | 'statutory' | 'documents'>('statutory');
    const [isEditing, setIsEditing] = useState(false);
    const [showPayslip, setShowPayslip] = useState(false);
    const [showIDCard, setShowIDCard] = useState(false);
    const [loading, setLoading] = useState(true);

    // Employee State
    const [employee, setEmployee] = useState<any>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const endpoint = id ? `/employee/${id}` : '/employee/me';
                const res = await api.get(endpoint);
                setEmployee(res.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
                toast.error('Failed to load employee profile');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleSave = async () => {
        try {
            const profileData = {
                phone: employee.employeeProfile?.phone,
                dob: employee.employeeProfile?.dob,
                bloodGroup: employee.employeeProfile?.bloodGroup,
                address: employee.employeeProfile?.address,
                location: employee.employeeProfile?.location,
                department: employee.employeeProfile?.department,
                title: employee.employeeProfile?.title,
                // Statutory
                uan: employee.employeeProfile?.statutory?.uan,
                pfNumber: employee.employeeProfile?.statutory?.pfNumber,
                esic: employee.employeeProfile?.statutory?.esic,
                pan: employee.employeeProfile?.statutory?.pan,
                aadhaar: employee.employeeProfile?.statutory?.aadhaar,
                // Bank
                bankName: employee.employeeProfile?.bank?.bankName,
                accountNumber: employee.employeeProfile?.bank?.accountNumber,
                ifsc: employee.employeeProfile?.bank?.ifsc
            };

            await api.put(`/employee/${id}`, profileData);
            setIsEditing(false);
            toast.success('Profile Updated Successfully!');
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEmployee((prev: any) => ({
            ...prev,
            employeeProfile: {
                ...prev.employeeProfile,
                [field]: value
            }
        }));
    };

    const handleStatutoryChange = (field: string, value: string) => {
        setEmployee((prev: any) => ({
            ...prev,
            employeeProfile: {
                ...prev.employeeProfile,
                statutory: {
                    ...prev.employeeProfile.statutory,
                    [field]: value
                }
            }
        }));
    };

    const handleBankChange = (field: string, value: string) => {
        setEmployee((prev: any) => ({
            ...prev,
            employeeProfile: {
                ...prev.employeeProfile,
                bank: {
                    ...prev.employeeProfile.bank,
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-brand-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading Profile Details...</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Not Found</h2>
                <button onClick={() => navigate('/employee')} className="mt-4 text-brand-600 hover:underline">Return to List</button>
            </div>
        );
    }

    const profile = employee.employeeProfile || {};
    const statutory = profile.statutory || {};
    const bank = profile.bank || {};

    return (
        <div className="animate-fade-in-up pb-8 relative">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
                disabled={isEditing}
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            {/* Profile Header */}
            <div className="bg-white dark:bg-brand-900 rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl bg-brand-600`}>
                        {employee.name.split(' ').map((n: any) => n[0]).join('')}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{employee.name}</h1>
                        <p className="text-lg text-brand-600 dark:text-brand-400 font-medium mb-4">{profile.title || 'Employee'} • {profile.department || 'N/A'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <Briefcase size={16} /> ID: {employee.id}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                {profile.location || 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all font-bold flex items-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all font-bold flex items-center gap-2">
                                <Edit size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10 overflow-x-auto pb-1">
                {['statutory', 'documents', 'personal'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 px-2 font-medium transition-all whitespace-nowrap capitalize ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab === 'statutory' ? 'Statutory & Bank Info' : tab === 'personal' ? 'Personal Details' : 'Document Vault'}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Detail Card */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'statutory' && (
                        <div className="bg-white dark:bg-brand-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-fade-in-up">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="text-brand-500" /> Statutory Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'UAN (Provident Fund)', key: 'uan' },
                                    { label: 'ESIC Number', key: 'esic' },
                                    { label: 'PAN Number', key: 'pan' },
                                    { label: 'Aadhaar Number', key: 'aadhaar' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">{field.label}</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={(statutory as any)[field.key] || ''}
                                                onChange={(e) => handleStatutoryChange(field.key, e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none"
                                            />
                                        ) : (
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{(statutory as any)[field.key] || 'N/A'}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <hr className="my-8 border-gray-100 dark:border-white/10" />

                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="text-green-500" /> Bank Account
                            </h3>

                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Bank Name</label>
                                        <input
                                            type="text"
                                            value={bank.bankName || ''}
                                            onChange={(e) => handleBankChange('bankName', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Account Number</label>
                                        <input
                                            type="text"
                                            value={bank.accountNumber || ''}
                                            onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={bank.ifsc || ''}
                                            onChange={(e) => handleBankChange('ifsc', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-brand-500/50 outline-none uppercase"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl max-w-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <p className="text-gray-400 text-sm mb-1">Bank Name</p>
                                    <p className="text-xl font-bold mb-6">{bank.bankName || 'N/A'}</p>
                                    <p className="text-gray-400 text-sm mb-1">Account Number</p>
                                    <p className="text-2xl font-mono tracking-wider mb-6">{bank.accountNumber || 'N/A'}</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase">IFSC Code</p>
                                            <p className="font-mono">{bank.ifsc || 'N/A'}</p>
                                        </div>
                                        <div className="w-10 h-6 bg-yellow-500/80 rounded"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="bg-white dark:bg-brand-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="text-orange-500" /> Document Vault
                                </h3>
                                {hasPermission(['HR_ADMIN']) && (
                                    <button className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                                        <Upload size={16} /> Upload New
                                    </button>
                                )}
                            </div>

                            {profile.documents?.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.documents.map((doc: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">Added on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isEditing && (
                                                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                        <X size={20} />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-brand-600 transition-colors">
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                                    <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                                    <p className="text-gray-500">No documents uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'personal' && (
                        <div className="bg-white dark:bg-brand-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-fade-in-up">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                    {isEditing ? (
                                        <input type="text" value={profile.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none" />
                                    ) : <p className="font-semibold">{profile.phone || 'N/A'}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                    {/* Email logic is handled by User model, not Editable profile here easily for now */}
                                    <p className="font-semibold text-gray-500">{employee.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Date of Birth</label>
                                    {isEditing ? (
                                        <input type="date" value={profile.dob ? profile.dob.split('T')[0] : ''} onChange={(e) => handleInputChange('dob', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none" />
                                    ) : <p className="font-semibold">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Blood Group</label>
                                    {isEditing ? (
                                        <input type="text" value={profile.bloodGroup || ''} onChange={(e) => handleInputChange('bloodGroup', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none" />
                                    ) : <p className="font-semibold">{profile.bloodGroup || 'N/A'}</p>}
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                                    {isEditing ? (
                                        <input type="text" value={profile.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none" />
                                    ) : <p className="font-semibold">{profile.address || 'N/A'}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                                    {isEditing && hasPermission(['HR_ADMIN']) ? (
                                        <div className="flex gap-4 mt-2">
                                            {['Active', 'Inactive', 'OnNotice'].map((s) => (
                                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={s}
                                                        checked={profile.status === s}
                                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block mt-1 ${profile.status === 'Active'
                                            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                            }`}>
                                            {profile.status || 'Active'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPayslip(true)}
                                className="w-full py-2.5 px-4 bg-brand-50 dark:bg-white/5 text-brand-700 dark:text-brand-300 rounded-xl text-sm font-medium hover:bg-brand-100 transition-colors text-left flex items-center gap-3"
                            >
                                <FileText size={16} /> Generate Payslip
                            </button>
                            <button
                                onClick={() => setShowIDCard(true)}
                                className="w-full py-2.5 px-4 bg-brand-50 dark:bg-white/5 text-brand-700 dark:text-brand-300 rounded-xl text-sm font-medium hover:bg-brand-100 transition-colors text-left flex items-center gap-3"
                            >
                                <User size={16} /> ID Card Preview
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Payslip Modal (Keep original UI logic, but ensure it uses the dynamic data) */}
            {showPayslip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                            <h3 className="text-xl font-bold font-mono text-gray-800 dark:text-white">Payslip Preview</h3>
                            <button onClick={() => setShowPayslip(false)} className="bg-gray-200 dark:bg-white/10 p-2 rounded-full hover:bg-gray-300 transition-colors">
                                <X size={20} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        <div className="p-8 bg-gray-100 dark:bg-white/5 overflow-x-auto flex justify-center">
                            <div id="payslip-content" className="w-[210mm] min-w-[210mm] bg-white border border-gray-300 p-8 min-h-[297mm] shadow-lg relative text-gray-900">
                                <div className="flex justify-between items-start border-b-2 border-brand-900 pb-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-brand-900 text-white flex items-center justify-center font-bold text-2xl rounded-lg">EH</div>
                                        <div className="text-right">
                                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">EnCalm <span className="text-brand-600">HRX</span></h1>
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-2">
                                        <p>EncalmIT Consultancy Pvt. Ltd.</p>
                                        <p>Gurgaon, Haryana, India</p>
                                        <p>CIN: U12345HR2023PTC123456</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2 border-b pb-1">Employee Details</h4>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-gray-500 font-medium">Name:</span>
                                            <span className="col-span-2 font-bold">{employee.name}</span>
                                            <span className="text-gray-500 font-medium">Employee ID:</span>
                                            <span className="col-span-2 font-bold">{employee.id}</span>
                                            <span className="text-gray-500 font-medium">Designation:</span>
                                            <span className="col-span-2 font-bold">{profile.title || 'N/A'}</span>
                                            <span className="text-gray-500 font-medium">Department:</span>
                                            <span className="col-span-2 font-bold">{profile.department || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2 border-b pb-1">Bank & Pan Details</h4>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-gray-500 font-medium">Bank Name:</span>
                                            <span className="col-span-2 font-bold">{bank.bankName || 'N/A'}</span>
                                            <span className="text-gray-500 font-medium">Account No:</span>
                                            <span className="col-span-2 font-bold">XXXX{(bank.accountNumber || '').slice(-4)}</span>
                                            <span className="text-gray-500 font-medium">PAN Number:</span>
                                            <span className="col-span-2 font-bold">{statutory.pan || 'N/A'}</span>
                                            <span className="text-gray-500 font-medium">UAN:</span>
                                            <span className="col-span-2 font-bold">{statutory.uan || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-sm mb-8">
                                    <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-200">
                                        <div className="p-3 font-bold text-gray-700 text-sm uppercase text-center border-r border-gray-200">Earnings</div>
                                        <div className="p-3 font-bold text-gray-700 text-sm uppercase text-center">Deductions</div>
                                    </div>
                                    <div className="grid grid-cols-2 text-sm min-h-[200px]">
                                        <div className="border-r border-gray-200 p-0">
                                            <div className="flex justify-between p-3 border-b border-gray-100">
                                                <span className="text-gray-600">Basic Salary</span>
                                                <span className="font-semibold">₹ 0.00</span>
                                            </div>
                                            <div className="flex justify-between p-3 italic text-gray-400">
                                                <span>Salary structure pending setup...</span>
                                            </div>
                                        </div>
                                        <div className="p-0">
                                            <div className="flex justify-between p-3 border-b border-gray-100">
                                                <span className="text-gray-600">Total Deductions</span>
                                                <span className="font-bold text-red-700">₹ 0.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center text-xs text-gray-400 mt-auto pt-8 border-t border-gray-100">
                                    <p>This is a computer-generated document and does not require a signature.</p>
                                    <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-center">
                        <button
                            onClick={() => {
                                const input = document.getElementById('payslip-content');
                                if (input) {
                                    html2canvas(input, { scale: 2 }).then((canvas) => {
                                        const imgData = canvas.toDataURL('image/png');
                                        const pdf = new jsPDF('p', 'mm', 'a4');
                                        const pdfWidth = pdf.internal.pageSize.getWidth();
                                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                                        pdf.save(`Payslip_${employee.name}.pdf`);
                                    });
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                        >
                            <Download size={20} /> Download PDF
                        </button>
                    </div>
                </div>
            )}

            {/* ID Card Modal (Keep original UI logic, with dynamic data) */}
            {showIDCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                    <div className="relative">
                        <button onClick={() => setShowIDCard(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
                            <X size={24} />
                        </button>

                        <div className="w-[320px] h-[500px] bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col">
                            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-br from-brand-800 to-brand-600 rounded-b-[50px] z-0"></div>
                            <div className="mx-auto w-16 h-3 bg-white/20 rounded-full mt-4 relative z-10 backdrop-blur-sm"></div>
                            <div className="flex justify-between items-start mb-6 px-6 pt-4 relative z-10">
                                <h2 className="text-white font-bold tracking-widest text-lg opacity-90">EnCalm <span className="text-brand-300">HRX</span></h2>
                                <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-80 shadow-inner border border-yellow-300/50"></div>
                            </div>
                            <div className="relative z-10 mx-auto mt-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-brand-600 flex items-center justify-center text-white font-bold text-4xl">
                                    {employee.name.split(' ').map((n:any) => n[0]).join('')}
                                </div>
                            </div>
                            <div className="text-center mt-4 flex-1 flex flex-col items-center">
                                <h1 className="text-2xl font-bold text-gray-800 px-4">{employee.name}</h1>
                                <p className="text-brand-600 font-medium text-sm mt-1">{profile.title || 'Employee'}</p>
                                <div className="w-12 h-1 bg-brand-200 rounded-full my-4"></div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left text-sm w-full px-10">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Emp ID</p>
                                        <p className="font-semibold text-gray-700">{employee.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Blood Group</p>
                                        <p className="font-semibold text-gray-700">{profile.bloodGroup || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Department</p>
                                        <p className="font-semibold text-gray-700">{profile.department || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-200 flex items-center justify-center text-[8px] text-gray-400 uppercase">QR Code</div>
                                <div className="text-right italic text-gray-400 text-xs">Authorized Sig.</div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button className="flex items-center gap-2 px-6 py-2 bg-white text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                                <Printer size={18} /> Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
