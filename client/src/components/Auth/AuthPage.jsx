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
        <div className="min-h-screen bg-ctp-crust flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ctp-mantle to-ctp-crust">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ctp-blue/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ctp-mauve/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-ctp-blue/20 rounded-2xl text-ctp-blue">
                            <Cloud size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-ctp-text">autumn drive</h1>
                    <p className="text-ctp-subtext0 mt-2">Secure cloud storage powered by Discord</p>
                </div>

                {/* Card */}
                <div className="bg-ctp-mantle/80 backdrop-blur-xl rounded-3xl border border-ctp-surface0/20 p-8 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex mb-8 bg-ctp-base/50 rounded-xl p-1">
                        <button
                            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${isLogin
                                ? "bg-ctp-blue text-ctp-base shadow-lg"
                                : "text-ctp-subtext0 hover:text-ctp-text"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${!isLogin
                                ? "bg-ctp-blue text-ctp-base shadow-lg"
                                : "text-ctp-subtext0 hover:text-ctp-text"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-ctp-red/10 border border-ctp-red/20 rounded-xl text-ctp-red text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-ctp-green/10 border border-ctp-green/20 rounded-xl text-ctp-green text-sm font-medium">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-ctp-subtext0 flex items-center gap-2">
                                <Mail size={14} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-ctp-base/60 border border-ctp-surface0/30 rounded-xl text-ctp-text placeholder-ctp-subtext0/50 focus:outline-none focus:ring-2 focus:ring-ctp-blue/50 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-ctp-subtext0 flex items-center gap-2">
                                <Lock size={14} />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-ctp-base/60 border border-ctp-surface0/30 rounded-xl text-ctp-text placeholder-ctp-subtext0/50 focus:outline-none focus:ring-2 focus:ring-ctp-blue/50 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-ctp-subtext0 flex items-center gap-2">
                                    <Lock size={14} />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-ctp-base/60 border border-ctp-surface0/30 rounded-xl text-ctp-text placeholder-ctp-subtext0/50 focus:outline-none focus:ring-2 focus:ring-ctp-blue/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-ctp-blue hover:bg-ctp-blue/90 text-ctp-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ctp-blue/20"
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
                <p className="text-center mt-6 text-ctp-subtext0/60 text-sm">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
