import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const publicNavLinks = [
  { to: '#problem', label: 'Problem' },
  { to: '#solution', label: 'Solution' },
  { to: '#roles', label: 'Roles' },
  { to: '#how-it-works', label: 'How it Works' },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark/95 backdrop-blur-xl border-b border-border-dark shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-outfit font-bold text-lg text-white">
            Swa-Antarang
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {publicNavLinks.map(({ to, label }) => (
            <a
              key={to}
              href={to}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/ui/Login"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/ui/Login"
            className="text-sm font-semibold bg-white text-dark px-5 py-2.5 rounded-lg hover:bg-white/90 transition-all"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-dark/98 backdrop-blur-xl border-t border-border-dark px-6 py-5 space-y-1">
          {publicNavLinks.map(({ to, label }) => (
            <a
              key={to}
              href={to}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="pt-4 space-y-2 border-t border-border-dark mt-2">
            <Link
              to="/ui/Login"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-semibold text-accent"
            >
              Login
            </Link>
            <Link
              to="/ui/Login"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-center font-semibold bg-white text-dark rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
