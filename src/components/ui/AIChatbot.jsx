import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { chatWithGemini } from '../../services/aiService';
import { useAuth } from '../../app/providers/AuthContext';

export default function AIChatbot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const role = user?.role || 'customer';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input.trim(), id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const history = [...messages, userMsg].map(m => ({ role: m.role, text: m.text }));
            const response = await chatWithGemini(history, role);
            setMessages(prev => [...prev, { role: 'model', text: response, id: Date.now() + 1 }]);
        } catch {
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong. Please try again.', id: Date.now() + 1 }]);
        } finally {
            setIsLoading(false);
        }
    };

    const greetings = {
        merchant: 'Hi! I can help with inventory, orders, routes & more.',
        driver: 'Hey! Ask me about routes, deliveries or anything.',
        customer: 'Hello! Need help finding products or tracking orders?',
    };

    return (
        <>
            {/* FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[1500] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors"
                style={{ background: isOpen ? '#450d24' : 'linear-gradient(135deg, #59112e 0%, #851e45 100%)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={22} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Sparkles size={22} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                        className="fixed bottom-40 md:bottom-24 right-4 md:right-6 z-[1500] w-[340px] md:w-[380px] bg-white rounded-3xl shadow-2xl border border-[#f2d8e4] overflow-hidden flex flex-col"
                        style={{ maxHeight: 'min(520px, calc(100vh - 180px))' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#59112e] to-[#851e45] p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm">Swa AI Assistant</h3>
                                <p className="text-white/70 text-[10px] font-medium">Powered by Gemini • {role} mode</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <X size={16} className="text-white/70" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]" style={{ minHeight: '280px' }}>
                            {/* Welcome message */}
                            {messages.length === 0 && (
                                <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot size={14} className="text-[#59112e]" />
                                    </div>
                                    <div className="bg-white border border-[#f2d8e4] rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
                                        <p className="text-xs text-gray-700 leading-relaxed">{greetings[role]}</p>
                                    </div>
                                </div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role !== 'user' && (
                                        <div className="w-7 h-7 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot size={14} className="text-[#59112e]" />
                                        </div>
                                    )}
                                    <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-sm ${msg.role === 'user'
                                            ? 'bg-[#59112e] text-white rounded-tr-sm'
                                            : 'bg-white border border-[#f2d8e4] text-gray-700 rounded-tl-sm'
                                        }`}>
                                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-7 h-7 rounded-full bg-[#59112e]/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <User size={14} className="text-[#59112e]" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-[#fdf2f6] flex items-center justify-center shrink-0">
                                        <Bot size={14} className="text-[#59112e]" />
                                    </div>
                                    <div className="bg-white border border-[#f2d8e4] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Loader2 size={12} className="text-[#59112e] animate-spin" />
                                            <span className="text-[10px] text-gray-400 font-medium">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-[#f2d8e4]">
                            <div className="flex gap-2 items-center">
                                <input
                                    ref={inputRef}
                                    className="flex-1 bg-[#fafafa] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#59112e]/20 border border-[#f2d8e4] transition-all placeholder:text-gray-400"
                                    placeholder="Ask me anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="w-9 h-9 rounded-xl bg-[#59112e] text-white flex items-center justify-center hover:bg-[#450d24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#59112e]/20"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
