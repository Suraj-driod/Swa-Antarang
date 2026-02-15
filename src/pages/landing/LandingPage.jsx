import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Truck, ShoppingBag, Package, ArrowRight, ArrowUpRight, Zap, Eye, Route } from 'lucide-react';

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  return (
    <div className="bg-dark">

      {/* ════════════════════════════════
          HERO — Full Dark, Huge Type
      ════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 hero-grid" />
        {/* Glow */}
        <div className="absolute inset-0 hero-glow" />
        {/* Top-right blob */}
        <div className="glow-blob w-[600px] h-[600px] bg-accent/10 -top-40 -right-40" />
        {/* Bottom-left blob */}
        <div className="glow-blob w-[500px] h-[500px] bg-primary/20 -bottom-32 -left-32" />

        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-20 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fade}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-dark bg-white/5 text-white/50 text-xs font-outfit font-medium tracking-wider uppercase mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Network Protocol v1
          </motion.span>

          <motion.h1
            variants={fade}
            custom={1}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-white tracking-tight leading-[0.95]"
          >
            The Operating Layer
            <br />
            <span className="text-gradient font-display italic">
              for Local Commerce.
            </span>
          </motion.h1>

          <motion.p
            variants={fade}
            custom={2}
            className="mt-8 sm:mt-10 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-outfit leading-relaxed"
          >
            Swa-Antarang is a universal resource discovery protocol.
            <br className="hidden sm:block" />
            Merchants broadcast. Drivers move. Customers discover.
            <br className="hidden sm:block" />
            One network. Zero silos.
          </motion.p>

          <motion.div
            variants={fade}
            custom={3}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/ui/Login"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-dark font-outfit font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-2xl hover:shadow-white/10 text-base"
            >
              Start Broadcasting
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border-dark text-white/70 font-outfit font-medium rounded-xl hover:border-white/30 hover:text-white transition-all text-base"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fade}
            custom={5}
            className="mt-20 flex justify-center"
          >
            <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          STATEMENT — Big Bold Paragraph
      ════════════════════════════════ */}
      <section className="relative bg-dark py-28 sm:py-36 px-6 sm:px-8">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <motion.div
          className="relative z-10 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.p
            variants={fade}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-white/90 leading-snug tracking-tight"
          >
            Local commerce is broken into silos.{' '}
            <span className="text-white/30">
              Merchants can&apos;t see demand. Drivers can&apos;t find loads.
              Customers can&apos;t find what&apos;s actually available nearby.
            </span>
          </motion.p>
          <motion.p
            variants={fade}
            custom={1}
            className="mt-8 text-lg text-accent font-outfit font-medium"
          >
            We&apos;re building the infrastructure to fix that.
          </motion.p>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          PROBLEM — Dark Elevated
      ════════════════════════════════ */}
      <section id="problem" className="relative bg-dark-soft py-28 sm:py-36 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.span variants={fade} className="text-accent font-outfit text-sm font-semibold tracking-wider uppercase">
              The Problem
            </motion.span>
            <motion.h2
              variants={fade}
              custom={1}
              className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Three roles.
              <br />
              <span className="text-white/30">Zero shared infrastructure.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-16 grid md:grid-cols-3 gap-px bg-border-dark rounded-2xl overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {[
              {
                title: 'Fragmented Supply',
                desc: 'Merchants, drivers, and buyers operate in complete isolation. No shared visibility. No coordination layer.',
                num: '01',
              },
              {
                title: 'No Interoperability',
                desc: 'Systems don\'t talk. Manual handoffs and duplicate data entry are the norm. Every connection is a bottleneck.',
                num: '02',
              },
              {
                title: 'Manual Everything',
                desc: 'Phone calls to coordinate. Spreadsheets to track. WhatsApp for updates. Fragile by design.',
                num: '03',
              },
            ].map((item) => (
              <motion.div
                key={item.num}
                variants={fade}
                className="bg-dark-muted p-8 sm:p-10"
              >
                <span className="text-accent/40 font-outfit text-sm font-bold">{item.num}</span>
                <h3 className="mt-4 text-xl font-outfit font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/40 font-outfit leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          SOLUTION — Light Break
      ════════════════════════════════ */}
      <section id="solution" className="relative bg-white py-28 sm:py-36 px-6 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 light-grid" />
        {/* Accent glow */}
        <div className="glow-blob w-[500px] h-[500px] bg-primary/5 top-0 right-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.span variants={fade} className="text-accent font-outfit text-sm font-semibold tracking-wider uppercase">
              The Solution
            </motion.span>
            <motion.h2
              variants={fade}
              custom={1}
              className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-main tracking-tight leading-[1.05]"
            >
              One protocol.
              <br />
              <span className="text-gradient">Every participant connected.</span>
            </motion.h2>
            <motion.p
              variants={fade}
              custom={2}
              className="mt-6 text-lg text-text-soft font-outfit max-w-2xl leading-relaxed"
            >
              Swa-Antarang creates a shared nervous system for local commerce —
              real-time inventory broadcasting, intelligent routing, and unified order flow.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {[
              {
                icon: Zap,
                title: 'Unified Network',
                desc: 'Merchants, drivers, and customers — one interoperable ecosystem with shared state.',
              },
              {
                icon: Eye,
                title: 'Inventory Broadcasting',
                desc: 'Real-time stock visibility across the entire network. Publish once, reach everywhere.',
              },
              {
                icon: Route,
                title: 'Live Tracking',
                desc: 'End-to-end delivery tracking from merchant shelf to customer doorstep. Full transparency.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fade}
                className="group relative p-8 rounded-2xl border border-gray-100 hover:border-accent/20 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-outfit font-semibold text-text-main">{title}</h3>
                <p className="mt-3 text-sm text-text-soft font-outfit leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          ROLES — Dark, Editorial
      ════════════════════════════════ */}
      <section id="roles" className="relative bg-dark py-28 sm:py-36 px-6 sm:px-8">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.span variants={fade} className="text-accent font-outfit text-sm font-semibold tracking-wider uppercase">
              Built for Every Role
            </motion.span>
            <motion.h2
              variants={fade}
              custom={1}
              className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Three perspectives.
              <br />
              <span className="text-white/30">One network truth.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {[
              {
                icon: Store,
                label: 'Merchants',
                title: 'Broadcast & Fulfill',
                desc: 'Manage inventory, broadcast availability across the network, and fulfill orders in real-time. Your shop — visible to the whole city.',
                gradient: 'from-primary to-accent',
              },
              {
                icon: Truck,
                label: 'Drivers',
                title: 'Move & Earn',
                desc: 'Accept deliveries matched to your route, optimize with live maps, and earn with transparent payouts. No dispatcher needed.',
                gradient: 'from-[#4a1024] to-primary',
              },
              {
                icon: ShoppingBag,
                label: 'Customers',
                title: 'Discover & Track',
                desc: 'Browse real-time local inventory, place orders from any merchant on the network, and track delivery to your door.',
                gradient: 'from-[#1a5c3a] to-[#2d8a5e]',
              },
            ].map(({ icon: Icon, label, title, desc, gradient }) => (
              <motion.div
                key={label}
                variants={fade}
                className="group relative rounded-2xl border border-border-dark bg-dark-muted overflow-hidden hover:border-white/15 transition-all duration-500"
              >
                {/* Top gradient bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
                <div className="p-8 sm:p-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-outfit font-semibold tracking-wider uppercase text-white/30">
                    For {label}
                  </span>
                  <h3 className="mt-2 text-2xl font-outfit font-bold text-white">{title}</h3>
                  <p className="mt-4 text-sm text-white/40 font-outfit leading-relaxed">{desc}</p>
                  <Link
                    to="/ui/Login"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-outfit font-medium text-accent hover:text-white transition-colors"
                  >
                    Enter as {label}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS — Light, Minimal Timeline
      ════════════════════════════════ */}
      <section id="how-it-works" className="relative bg-white py-28 sm:py-36 px-6 sm:px-8">
        <div className="absolute inset-0 light-grid" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.span variants={fade} className="text-accent font-outfit text-sm font-semibold tracking-wider uppercase">
              How It Works
            </motion.span>
            <motion.h2
              variants={fade}
              custom={1}
              className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-main tracking-tight leading-[1.05]"
            >
              Four steps to
              <br />
              <span className="text-gradient">a connected supply chain.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-20 space-y-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {[
              { step: '01', title: 'Merchants broadcast inventory', desc: 'Stock and availability flow into the network in real time. No phone calls. No middlemen.' },
              { step: '02', title: 'Drivers see available loads', desc: 'Fleet views available jobs matched by route and capacity. Accept with one tap.' },
              { step: '03', title: 'Customers browse & order', desc: 'Local inventory is surfaced. Orders are placed and routed automatically through the network.' },
              { step: '04', title: 'End-to-end visibility', desc: 'Everyone — merchant, driver, customer — sees real-time status from shelf to doorstep.' },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={fade}
                custom={i}
                className="group flex gap-6 sm:gap-10 py-8 border-b border-gray-100 last:border-0"
              >
                <span className="flex-shrink-0 w-12 text-3xl font-outfit font-bold text-accent/20 group-hover:text-accent transition-colors duration-500">
                  {step}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-outfit font-semibold text-text-main group-hover:text-primary transition-colors duration-500">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-text-soft font-outfit leading-relaxed max-w-lg">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — Dark, Dramatic
      ════════════════════════════════ */}
      <section className="relative bg-dark py-32 sm:py-40 px-6 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 hero-glow-strong" />
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="glow-blob w-[600px] h-[400px] bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fade}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]"
          >
            Ready to join
            <br />
            <span className="text-gradient italic">the network?</span>
          </motion.h2>
          <motion.p
            variants={fade}
            custom={1}
            className="mt-6 text-lg text-white/50 font-outfit max-w-lg mx-auto"
          >
            Connect your business to Swa-Antarang.
            Start broadcasting, moving, and trading today.
          </motion.p>
          <motion.div
            variants={fade}
            custom={2}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/ui/Login"
              className="group inline-flex items-center justify-center gap-2.5 px-10 py-4.5 bg-white text-dark font-outfit font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-2xl hover:shadow-white/10 text-base"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#roles"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border-dark text-white/60 font-outfit font-medium rounded-xl hover:border-white/30 hover:text-white transition-all text-base"
            >
              Explore Roles
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="bg-dark border-t border-border-dark py-14 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
              <Package size={16} />
            </div>
            <span className="font-outfit font-bold text-white">Swa-Antarang</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-outfit">
            <a href="#" className="text-white/30 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">Terms</a>
            <Link to="/ui/Login" className="text-white/30 hover:text-white transition-colors">Login</Link>
          </nav>
          <span className="text-xs text-white/20 font-outfit">
            &copy; {new Date().getFullYear()} Swa-Antarang
          </span>
        </div>
      </footer>
    </div>
  );
}
