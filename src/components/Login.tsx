import React, { useState } from 'react';
import { Heart, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login } from '../services/authService';

interface LoginProps {
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setLoading(true);
        setError('');

        try {
            const result = await login(username, password);
            if (result.success) {
                onLoginSuccess();
            } else {
                setError(result.error || '登录失败，请检查用户名和密码');
            }
        } catch (err) {
            setError('发生错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* 动态背景装饰 */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-love-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-love-lg border border-white/60">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-love-100 to-rose-100 mb-6 shadow-inner animate-bounce-in">
                            <Heart className="w-8 h-8 text-love-500 fill-love-500" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-love-600 to-rose-600 bg-clip-text text-transparent mb-2">
                            欢迎回来
                        </h1>
                        <p className="text-slate-400 text-sm">
                            登录以继续记录你们的美好时光
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-love-500 transition-colors duration-300">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-love-200 focus:ring-4 focus:ring-love-100 transition-all duration-300 outline-none"
                                        placeholder="用户名"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-love-500 transition-colors duration-300">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-love-200 focus:ring-4 focus:ring-love-100 transition-all duration-300 outline-none"
                                        placeholder="密码"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl animate-fade-in">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-love-500 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-love-500/30 hover:shadow-love-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>登录中...</span>
                                </>
                            ) : (
                                <>
                                    <span>进入空间</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-300">
                            Timeless © 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
