import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Phone,
    MoreVertical,
    Paperclip,
    Smile,
    Check,
    CheckCheck,
    ArrowLeft,
    MapPin,
    Package
} from 'lucide-react';

// Mock chat data generator
const getMockMessages = (contact) => [
    {
        id: 1,
        sender: 'them',
        text: `Hi! I'm ${contact?.name || 'the merchant'}. Your order is ready for pickup.`,
        time: '10:30 AM',
        status: 'read',
    },
    {
        id: 2,
        sender: 'me',
        text: 'Great, I\'m on my way. ETA 10 minutes.',
        time: '10:32 AM',
        status: 'read',
    },
    {
        id: 3,
        sender: 'them',
        text: 'Perfect. Please come to the back entrance.',
        time: '10:33 AM',
        status: 'read',
    },
];

const ChatWidget = ({ isOpen, onClose, contact }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && contact) {
            setMessages(getMockMessages(contact));
        }
    }, [isOpen, contact]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
        }]);
        setInputText('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 w-full md:w-[420px] h-full md:h-[560px] md:max-h-[80vh] bg-white md:rounded-2xl shadow-2xl shadow-black/20 z-[70] flex flex-col overflow-hidden md:border md:border-slate-200"
                    >
                        {/* Header */}
                        <div className="bg-[#59112e] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/10">
                                    {contact?.avatar || contact?.name?.charAt(0) || 'M'}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold leading-tight">{contact?.name || 'Merchant'}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <p className="text-[11px] text-white/70 font-medium">{contact?.shop || 'Online'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                    <Phone size={18} />
                                </button>
                                <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Order Context Banner */}
                        {contact?.orderId && (
                            <div className="bg-[#fdf2f6] px-4 py-2.5 border-b border-[#f2d8e4] flex items-center gap-2.5">
                                <Package size={16} className="text-[#59112e] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#59112e]">{contact.orderId}</p>
                                    <p className="text-[11px] text-[#6b4c59] truncate">{contact.shop || 'Order Chat'}</p>
                                </div>
                                {contact.pay && (
                                    <span className="text-sm font-bold text-[#59112e]">{contact.pay}</span>
                                )}
                            </div>
                        )}

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-2"
                            style={{
                                backgroundImage: 'radial-gradient(#59112e 0.5px, transparent 0.5px)',
                                backgroundSize: '16px 16px',
                                backgroundColor: '#f8f5f0',
                                backgroundBlendMode: 'normal',
                            }}
                        >
                            {/* Security Notice */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#fff5c4]/90 backdrop-blur-sm text-slate-600 text-[11px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[280px]">
                                    🔒 Messages are end-to-end encrypted
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] text-sm relative ${msg.sender === 'me'
                                            ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-sm'
                                            : 'bg-white text-[#111b21] rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="mr-12 leading-relaxed">{msg.text}</p>
                                        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
                                            <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                                            {msg.sender === 'me' && (
                                                msg.status === 'read'
                                                    ? <CheckCheck size={14} className="text-[#53bdeb]" />
                                                    : msg.status === 'delivered'
                                                        ? <CheckCheck size={14} className="text-slate-400" />
                                                        : <Check size={14} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#f0f2f5] px-3 py-2.5 flex items-center gap-2 shrink-0 border-t border-slate-100">
                            <button className="text-slate-400 hover:text-[#59112e] transition-colors p-1">
                                <Smile size={22} />
                            </button>
                            <button className="text-slate-400 hover:text-[#59112e] transition-colors p-1">
                                <Paperclip size={22} />
                            </button>

                            <div className="flex-1 bg-white rounded-xl flex items-center overflow-hidden border border-slate-200 focus-within:border-[#59112e] transition-colors">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message"
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={handleSend}
                                className={`p-2.5 rounded-full transition-all ${inputText.trim()
                                    ? 'bg-[#59112e] text-white shadow-md hover:scale-105'
                                    : 'bg-slate-200 text-slate-400'
                                    }`}
                            >
                                <Send size={18} className="ml-0.5" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatWidget;
