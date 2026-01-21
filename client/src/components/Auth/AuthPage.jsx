import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Cloud, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError("Password must be at least 6 characters");
                    setLoading(false);
                    return;
                }
                await signUp(email, password);
                setSuccess("Account created! Please check your email to verify.");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-float"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4 relative group cursor-default">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg relative">
                            <Cloud size={32} className="text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">autumn<span className="text-blue-500">drive</span></h1>
                    <p className="text-gray-400">Secure cloud storage for your digital life</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                    {/* Tabs */}
                    <div className="flex mb-8 bg-black/20 rounded-xl p-1.5 backdrop-blur-md">
                        <button
                            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${isLogin
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${!isLogin
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                                <Mail size={14} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-black/20 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                                <Lock size={14} />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 bg-black/20 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2 group animate-fade-in">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                                    <Lock size={14} />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-black/20 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-8 text-gray-600 text-xs font-medium">
                    By continuing, you agree to our <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
