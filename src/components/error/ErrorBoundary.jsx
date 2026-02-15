import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    RefreshCw,
    Home,
    ChevronDown,
    ChevronUp,
    Terminal,
    Copy,
    Check
} from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            copied: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service like Sentry here
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleCopy = () => {
        const text = `${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
        navigator.clipboard.writeText(text);
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#fdf2f6] font-outfit flex items-center justify-center p-6 relative overflow-hidden">

                    {/* Background Decor */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#59112e 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
                    </div>
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#59112e]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-rose-500/5 rounded-full blur-3xl"></div>

                    {/* Error Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[32px] overflow-hidden relative z-10"
                    >

                        {/* Top Warning Strip */}
                        <div className="h-2 w-full bg-gradient-to-r from-[#59112e] via-rose-500 to-[#59112e]"></div>

                        <div className="p-8">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 shadow-sm mx-auto">
                                <AlertTriangle size={32} className="text-rose-600" strokeWidth={2.5} />
                            </div>

                            {/* Text Content */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-[#2d0b16] mb-2">System Malfunction</h1>
                                <p className="text-[#6b4c59] text-sm leading-relaxed">
                                    Our inventory tracking system encountered an unexpected issue.
                                    Don't worry, your data is safe. We've notified the engineering team.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                                <button
                                    onClick={this.handleReload}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    <RefreshCw size={18} />
                                    Reload Dashboard
                                </button>
                                <a
                                    href="/"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#f2d8e4] text-[#59112e] rounded-xl font-bold text-sm hover:bg-[#fdf2f6] hover:border-[#59112e]/30 transition-all active:scale-95"
                                >
                                    <Home size={18} />
                                    Go Home
                                </a>
                            </div>

                            {/* Developer Details Toggle */}
                            <div className="border-t border-[#f2d8e4] pt-6">
                                <button
                                    onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                                    className="flex items-center justify-center gap-2 text-xs font-bold text-[#6b4c59] hover:text-[#59112e] transition-colors w-full uppercase tracking-wider"
                                >
                                    {this.state.showDetails ? 'Hide' : 'View'} Technical Details
                                    {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                <AnimatePresence>
                                    {this.state.showDetails && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 bg-[#2d0b16] rounded-xl p-4 text-left relative group">
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={this.handleCopy}
                                                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
                                                        title="Copy Error Log"
                                                    >
                                                        {this.state.copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-rose-400 mb-2 border-b border-white/10 pb-2">
                                                    <Terminal size={14} />
                                                    <span className="text-[10px] font-mono font-bold uppercase">Error Log</span>
                                                </div>
                                                <pre className="font-mono text-[10px] text-rose-100/80 overflow-x-auto whitespace-pre-wrap max-h-40 scrollbar-thin scrollbar-thumb-white/20">
                                                    {this.state.error && this.state.error.toString()}
                                                    <br />
                                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;