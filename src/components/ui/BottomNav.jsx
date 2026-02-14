import { NavLink } from 'react-router-dom';

export default function BottomNav({ items }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 safe-area-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {items.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px] ${isActive
                                ? 'text-primary scale-105'
                                : 'text-gray-400 hover:text-gray-600 active:scale-95'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10' : ''}`}>
                                    <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                                </div>
                                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
