import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import officeWorkerImg from '../assets/office-worker-3d.png';
import vedaLogo from '../assets/veda-logo.png';

import { useAuth } from '../context/AuthContext';



export default function SignIn() {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { setTheme } = useTheme();
    const { login, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123'); // Default for demo
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    };
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const [forgotCaptcha, setForgotCaptcha] = useState(generateCaptcha());
    const [forgotCaptchaInput, setForgotCaptchaInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
    };

    const refreshForgotCaptcha = () => {
        setForgotCaptcha(generateCaptcha());
        setForgotCaptchaInput('');
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (captchaInput !== captcha) {
            alert("Invalid captcha");
            refreshCaptcha();
            return;
        }


        try {
            await login(email, 'HR_ADMIN');
            setTheme('dark');
            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed", err);

        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotMessage('');

        if (!forgotEmail.trim()) {
            setForgotMessage('Enter email');
            return;
        }

        if (forgotCaptchaInput !== forgotCaptcha) {
            setForgotMessage("Invalid captcha");
            refreshForgotCaptcha();
            return;
        }

        // 🟢 STEP 1: SEND OTP
        if (!isOtpSent) {
            try {
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: forgotEmail }),
                });

                if (!res.ok) throw new Error("Failed to send OTP");

                setIsOtpSent(true);
                setForgotMessage("OTP sent to email");
            } catch {
                setForgotMessage("Error sending OTP");
            }

            return; // stop here
        }

        // 🟢 STEP 2: UPDATE PASSWORD
        if (!otp) {
            setForgotMessage("Enter OTP");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setForgotMessage("Enter password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setForgotMessage("Passwords not match");
            return;
        }
        setIsUpdatingPassword(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotEmail,
                    otp: otp,
                    newPassword: newPassword,
                }),
            });

            if (!res.ok) throw new Error("Failed");

            setForgotMessage("Password updated");

            setTimeout(() => {
                setIsForgotMode(false);
                setIsOtpSent(false);
            }, 1500);

        } catch {
            setForgotMessage("Error updating password");
        }
        finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">

            {/* Background Gradients for the Page */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-900 to-brand-950 opacity-90 z-0"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-white/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-purple-600/20 rounded-full blur-3xl z-0 pointer-events-none"></div>

            {/* Card Container */}
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden relative z-10 animate-fade-in-up">

                {/* Left Panel - Illustration & Background */}
                <div className="md:w-1/2 bg-brand-50/50 relative overflow-visible flex flex-col justify-between p-8 md:p-12">
                    {/* Background Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/60 rounded-full mix-blend-overlay blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-200/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

                    {/* Logo Area */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-20 h-20 flex items-center justify-center">
                            <img src={vedaLogo} alt="EnCalm" className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">EnCalm HRX</span>
                    </div>
                    <div className="relative z-10 mt-0 md:ml-4 self-start">
                        <p className="text-gray-600 text-lg font-medium max-w-xs leading-relaxed">
                            Smart Payroll. Seamless Compliance. Scale with Confidence.
                        </p>
                    </div>

                    {/* Character - Positioned to peek over the edge */}
                    {/* Character - Positioned to peek over the edge without overlapping text */}
                    {/* Character - Centered in Left Panel */}
                    <div className="hidden md:flex absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[350px] md:w-[400px] lg:w-[450px] z-20 pointer-events-none justify-center">
                        <img
                            src={officeWorkerImg}
                            alt="Welcome"
                            className="w-full h-auto object-contain drop-shadow-xl transform translate-y-8 mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-8 overflow-hidden relative z-10">

                    {/* Decorative Floating Circles for Right Panel */}
                    <div className="absolute top-12 right-12 w-4 h-4 border-2 border-brand-200 rounded-full"></div>
                    <div className="absolute top-24 right-8 w-8 h-8 bg-brand-100/50 rounded-full blur-sm"></div>

                    <div className="w-full max-w-xs md:max-w-sm space-y-6">

                        {/* Logo / Header */}
                        <div className="text-center md:text-left mb-6 flex justify-center md:justify-start">
                            <img
                                src="/logo.png"
                                alt="Hospital Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                        {!isForgotMode ? (
                            <form onSubmit={handleLogin} className="space-y-3">

                                {/* Username Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Username or E-mail</label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="Enter your username"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all placeholder:text-gray-300 shadow-sm"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {/* Error Message */}
                                    {error && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{error}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wide">
                                        Captcha
                                    </label>

                                    <div className="flex gap-2 items-center">
                                        <div className="px-4 py-3 bg-gray-200 text-black rounded-xl font-bold tracking-widest shadow-inner">                                        {captcha}
                                        </div>

                                        {/* 🔄 Refresh Button */}
                                        <button
                                            type="button"
                                            onClick={refreshCaptcha}
                                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
                                        >
                                            🔄
                                        </button>

                                        <input
                                            type="text"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-black"
                                            placeholder="Enter captcha"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-lg rounded-full shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all transform"
                                    >
                                        Log In
                                    </button>
                                </div>

                            </form>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-3">

                                {/* STEP 1: BEFORE OTP */}
                                {!isOtpSent && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500">Email</label>
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all placeholder:text-gray-300 shadow-sm"
                                            />
                                        </div>

                                        {/* Captcha */}
                                        <div className="flex gap-2 items-center">
                                            <div className="px-4 py-3 bg-gray-200 text-black rounded-xl font-bold tracking-widest shadow-inner">
                                                {forgotCaptcha}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={refreshForgotCaptcha}
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
                                            >
                                                🔄
                                            </button>

                                            <input
                                                value={forgotCaptchaInput}
                                                onChange={(e) => setForgotCaptchaInput(e.target.value)}
                                                placeholder="Enter captcha"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-black"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* STEP 2: AFTER OTP */}
                                {isOtpSent && (
                                    <>
                                        <div>
                                            <label>OTP</label>
                                            <input
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl text-gray-700 font-medium transition-all shadow-sm"
                                            />
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-lg rounded-full shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all transform">
                                    {!isOtpSent ? 'Send OTP' : 'Update Password'}
                                </button>
                                {isForgotMode && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotMode(false);
                                            setIsOtpSent(false);
                                        }}
                                        className="w-full text-brand-500 font-bold hover:underline text-sm mt-2"
                                    >
                                        Back to Login
                                    </button>
                                )}

                            </form>
                        )}
                        {!isForgotMode && (
                            <div className="text-center space-y-5 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotMode(true);
                                        setForgotMessage('');
                                        setForgotEmail(email);
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setForgotCaptcha(generateCaptcha());
                                    }}
                                    className="text-brand-500 font-bold hover:underline text-xs md:text-sm block w-full"
                                >
                                    Forget Password?
                                </button>

                                <p className="text-gray-400 text-xs md:text-sm">
                                    Do Not Have Account?{" "}
                                    <button className="text-brand-500 font-bold hover:underline ml-1">
                                        Sign Up
                                    </button>
                                </p>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
