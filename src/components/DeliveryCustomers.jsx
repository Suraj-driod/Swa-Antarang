import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Mic,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Plus,
  Paperclip,
  Smile,
  MapPin,
  Package,
} from "lucide-react";

// --- MOCK DATA ---

const CUSTOMERS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    shop: "Acme Supplies Hub",
    avatar: "RK",
    status: "online",
    lastMessage: "The package arrived safely. Thanks!",
    time: "10:45 AM",
    unread: 2,
    rating: 4.9,
    trips: 42,
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    shop: "Fresh Foods Market",
    avatar: "SJ",
    status: "offline",
    lastMessage: "Can you pick up the return order?",
    time: "Yesterday",
    unread: 0,
    rating: 4.8,
    trips: 15,
  },
  {
    id: 3,
    name: "Amit Patel",
    shop: "Tech World",
    avatar: "AP",
    status: "online",
    lastMessage: "Photo",
    isMedia: true,
    time: "Tuesday",
    unread: 0,
    rating: 4.5,
    trips: 8,
  },
  {
    id: 4,
    name: "Priya Sharma",
    shop: "City Library",
    avatar: "PS",
    status: "offline",
    lastMessage: "I'll be there in 5 mins.",
    time: "Monday",
    unread: 1,
    rating: 5.0,
    trips: 3,
  },
];

const CHAT_HISTORY = [
  {
    id: 1,
    sender: "them",
    text: "Hey! Are you available for a bulk delivery tomorrow?",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    sender: "me",
    text: "Hi Rajesh! Yes, typically available after 11 AM.",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    sender: "them",
    text: "Perfect. I'll send the request through the app.",
    time: "10:33 AM",
    status: "read",
  },
  {
    id: 4,
    sender: "me",
    text: "Sounds good. Just mark it as 'Fragile' please.",
    time: "10:34 AM",
    status: "delivered",
  },
];

const DeliveryCustomers = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChat]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    setMessages([...messages, newMsg]);
    setInputText("");
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-outfit overflow-hidden">
      {/* --- LEFT SIDEBAR (Customer List) --- */}
      <div
        className={`w-full md:w-[400px] bg-white border-r border-slate-200 flex flex-col z-20 transition-all duration-300 ${
          activeChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-[#fdf2f6] px-4 py-3 flex justify-between items-center border-b border-[#f2d8e4]">
          <div className="w-10 h-10 rounded-full bg-white border border-[#f2d8e4] flex items-center justify-center overflow-hidden cursor-pointer">
            <span className="font-bold text-[#59112e]">ME</span>
          </div>
          <div className="flex gap-3 text-[#59112e]">
            <button className="w-10 h-10 rounded-full hover:bg-[#59112e]/10 flex items-center justify-center transition-colors">
              <Plus size={22} />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-[#59112e]/10 flex items-center justify-center transition-colors">
              <MoreVertical size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#59112e] transition-all"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
          {["All", "Unread", "Favourites", "Groups"].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                filter === "All"
                  ? "bg-[#fdf2f6] text-[#59112e]"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {CUSTOMERS.filter((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ).map((customer) => (
            <div
              key={customer.id}
              onClick={() => setActiveChat(customer)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-50 hover:bg-slate-50 ${
                activeChat?.id === customer.id
                  ? "bg-[#fdf2f6] hover:bg-[#fdf2f6]"
                  : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#59112e] to-[#9d174d] text-white flex items-center justify-center font-bold text-lg">
                  {customer.avatar}
                </div>
                {customer.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-800 truncate">
                    {customer.name}
                  </h4>
                  <span
                    className={`text-[10px] font-medium ${customer.unread > 0 ? "text-emerald-500" : "text-slate-400"}`}
                  >
                    {customer.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-slate-500 truncate pr-2">
                    {customer.isMedia && <ImageIcon size={14} />}
                    <span className="truncate">{customer.lastMessage}</span>
                  </div>
                  {customer.unread > 0 && (
                    <span className="min-w-[20px] h-5 flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5">
                      {customer.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT PANEL (Chat Window) --- */}
      <div
        className={`flex-1 flex-col bg-[#efeae2] relative ${
          activeChat ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#59112e 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#fdf2f6] px-4 py-3 flex justify-between items-center border-b border-[#f2d8e4] shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden text-[#59112e]"
                >
                  <ArrowLeft size={24} />
                </button>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#59112e] to-[#9d174d] text-white flex items-center justify-center font-bold text-sm">
                  {activeChat.avatar}
                </div>

                <div className="cursor-pointer">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {activeChat.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate w-32 md:w-auto">
                    {activeChat.shop} • {activeChat.trips} Trips
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#59112e]">
                <button className="hidden md:block hover:bg-white/50 p-2 rounded-full transition-colors">
                  <Search size={20} />
                </button>
                <button className="hover:bg-white/50 p-2 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button className="hover:bg-white/50 p-2 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 relative z-0">
              {/* Security Notice */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#fff5c4] text-slate-600 text-[10px] md:text-xs px-3 py-1.5 rounded-lg shadow-sm text-center max-w-md">
                  🔒 Messages are end-to-end encrypted. No one outside of this
                  chat, not even SupplierMatch, can read or listen to them.
                </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[65%] px-3 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-sm relative group ${
                      msg.sender === "me"
                        ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none"
                        : "bg-white text-[#111b21] rounded-tl-none"
                    }`}
                  >
                    <p className="mr-12 pb-1 leading-relaxed">{msg.text}</p>

                    <div className="absolute bottom-1 right-2 flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {msg.time}
                      </span>
                      {msg.sender === "me" &&
                        (msg.status === "read" ? (
                          <CheckCheck size={14} className="text-[#53bdeb]" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck size={14} className="text-slate-400" />
                        ) : (
                          <Check size={14} className="text-slate-400" />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-3 z-10">
              <button className="text-slate-500 hover:text-[#59112e]">
                <Smile size={24} />
              </button>
              <button className="text-slate-500 hover:text-[#59112e]">
                <Paperclip size={24} />
              </button>

              <div className="flex-1 bg-white rounded-lg flex items-center overflow-hidden border border-white focus-within:border-[#59112e] transition-colors">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                />
              </div>

              {inputText.trim() ? (
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-[#59112e] text-white rounded-full shadow-md hover:scale-105 transition-transform"
                >
                  <Send size={20} className="ml-0.5" />
                </button>
              ) : (
                <button className="text-slate-500 hover:text-[#59112e]">
                  <Mic size={24} />
                </button>
              )}
            </div>
          </>
        ) : (
          /* EMPTY STATE (Desktop) */
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 border-b-[6px] border-[#25d366]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mb-8"
            >
              <div className="w-64 h-64 rounded-full bg-[#fdf2f6] flex items-center justify-center relative z-0">
                <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Package size={80} className="text-[#59112e] opacity-20" />
                </div>
              </div>
              {/* Floating Bubbles Decoration */}
              <div className="absolute top-0 right-10 w-12 h-12 bg-[#59112e] rounded-full opacity-10 animate-pulse"></div>
              <div className="absolute bottom-4 left-10 w-8 h-8 bg-[#9d174d] rounded-full opacity-10 animate-bounce"></div>
            </motion.div>

            <h2 className="text-3xl font-light text-slate-700 mb-4">
              SupplierMatch{" "}
              <span className="font-bold text-[#59112e]">Web</span>
            </h2>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              Send and receive messages without keeping your phone online.
              <br />
              Use SupplierMatch on up to 4 linked devices and 1 phone.
            </p>

            <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-3 bg-slate-300 rounded-full flex items-center justify-center text-[8px] text-white">
                🔒
              </span>
              End-to-end encrypted
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCustomers;
