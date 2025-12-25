import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Upload, FileText, User, CreditCard } from 'lucide-react';

export default function AddEmployee() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        // Personal
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        location: '',
        // Statutory
        uan: '',
        esic: '',
        pan: '',
        aadhaar: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
    });

    const steps = [
        { id: 1, title: 'Personal Details', icon: User },
        { id: 2, title: 'Statutory Info', icon: CreditCard },
        { id: 3, title: 'Documents', icon: FileText },
    ];

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(c => c + 1);
        else {
            // Submit
            alert('Employee Onboarded Successfully!');
            navigate('/employee');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
        else navigate('/employee');
    };

    return (
        <div className="animate-fade-in-up pb-8">
            <button
                onClick={() => navigate('/employee')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            <div className="bg-white dark:bg-brand-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                {/* Header / Stepper */}
                <div className="bg-brand-50/50 dark:bg-white/5 p-8 border-b border-gray-100 dark:border-white/10">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Onboard New Employee</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Complete the following steps to add a new team member.</p>

                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep >= step.id
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                                        : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                                    }`}>
                                    {currentStep > step.id ? <Check size={20} /> : <step.icon size={18} />}
                                </div>
                                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                        {/* Progress Line */}
                        <div className="absolute top-[164px] left-0 w-full h-0.5 bg-gray-200 dark:bg-white/10 -z-0 hidden md:block">
                            <div
                                className="h-full bg-brand-500 transition-all duration-500 md:w-1/2 mx-auto"
                                style={{
                                    width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%',
                                    // This is a rough visual approximation for the line connector
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 max-w-4xl mx-auto">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="john.doe@encalm.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input type="tel" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white">
                                    <option>Select Department</option>
                                    <option>Engineering</option>
                                    <option>Design</option>
                                    <option>Product Management</option>
                                    <option>Sales & Marketing</option>
                                    <option>Human Resources</option>
                                    <option>Finance</option>
                                    <option>Operations</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Role / Designation</label>
                                <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="e.g. Senior Developer" />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-2">Statutory Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">PAN Number</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white uppercase font-mono" placeholder="ABCDE1234F" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Aadhaar Number</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white font-mono" placeholder="XXXX XXXX XXXX" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">UAN (PF)</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">ESIC Number</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-2">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Bank Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white" placeholder="e.g. HDFC Bank" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">IFSC Code</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white uppercase font-mono" placeholder="HDFC0001234" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-800 dark:text-white font-mono tracking-wider" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-3xl p-12 text-center group hover:border-brand-500 transition-colors cursor-pointer bg-gray-50 dark:bg-white/5">
                                <div className="w-16 h-16 bg-brand-100 dark:bg-white/10 text-brand-600 dark:text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Upload Onboarding Documents</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    Drag and drop files here, or click to browse. Supported format: PDF, JPG, PNG (Max 5MB).
                                </p>
                                <button className="px-6 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                                    Browse Files
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-500 uppercase">Required Documents</p>
                                {[
                                    { name: 'Aadhaar Card', required: true },
                                    { name: 'PAN Card', required: true },
                                    { name: 'Previous Employment Letter', required: false },
                                    { name: 'Highest Qualification Degree', required: true }
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-brand-800 border border-gray-100 dark:border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-gray-500">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {doc.name} {doc.required && <span className="text-red-500">*</span>}
                                                </p>
                                                <p className="text-xs text-gray-400">Not uploaded</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">Upload</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Navigation */}
                <div className="p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {currentStep === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all font-bold"
                    >
                        {currentStep === 3 ? 'Complete Onboarding' : 'Next Step'} <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
