export default function SalesPropogatinUI() {
  return (
    <div className="font-outfit flex h-screen bg-background text-text-main">

      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 bg-surface border-r border-border-soft p-6 hidden md:flex flex-col justify-between">

        <div className="space-y-8">

          <h1 className="text-primary text-xl font-bold">
            MerchantHub
          </h1>

          <nav className="space-y-2">

            {["Dashboard","Inventory","Orders","Settings"].map(item => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 rounded-xl text-text-soft hover:bg-primary-soft"
              >
                {item}
              </button>
            ))}

            <button className="w-full text-left px-4 py-2 rounded-xl bg-primary text-white font-semibold">
              B2B Sales
            </button>

          </nav>

        </div>

        <button className="text-text-soft">Log out</button>

      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Sales Propagation
          </h2>
          <p className="text-text-soft">
            Manage B2B requests and propagate inventory.
          </p>
        </div>

        {/* Top Grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Propagate Card */}
          <div className="bg-surface border border-border-soft rounded-2xl p-6 space-y-4">

            <h3 className="font-semibold text-primary">
              Propagate Item
            </h3>

            <select className="w-full border border-border-soft rounded-xl p-2">
              <option>Nike Air Max - 45 units</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input className="border border-border-soft rounded-xl p-2" placeholder="Price"/>
              <input className="border border-border-soft rounded-xl p-2" placeholder="Qty"/>
            </div>

            <button className="w-full bg-primary text-white py-2 rounded-xl">
              Propagate Offer
            </button>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-primary text-white rounded-2xl p-6">
              <p className="text-sm opacity-70">Active Listings</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>

            <div className="bg-surface border border-border-soft rounded-2xl p-6">
              <p className="text-sm text-text-soft">Pending Requests</p>
              <h3 className="text-3xl font-bold text-primary">8</h3>
            </div>

          </div>

        </div>

        {/* Table */}
        <div className="bg-surface border border-border-soft rounded-2xl p-6">

          <h3 className="font-semibold mb-4 text-primary">
            Incoming Responses
          </h3>

          <div className="space-y-3">

            {[
              ["Style Studio Inc.","$115"],
              ["Fashion Mart","$175"],
              ["Urban Drip","$295"]
            ].map(([name,price]) => (

              <div
                key={name}
                className="flex justify-between border-b border-border-soft pb-2"
              >
                <span>{name}</span>
                <span className="font-semibold">{price}/unit</span>
              </div>

            ))}

          </div>

        </div>

      </main>

      {/* ============ AI PANEL ============ */}
      <aside className="w-[380px] hidden lg:flex flex-col border-l border-border-soft bg-surface p-6">

        <h3 className="font-bold text-primary mb-4">
          Sales AI
        </h3>

        <div className="flex-1 space-y-3">

          <div className="bg-white p-3 rounded-xl">
            High demand detected for Footwear.
          </div>

          <div className="bg-primary text-white p-3 rounded-xl self-end">
            Yes, propagate it.
          </div>

        </div>

        <input
          className="mt-4 border border-border-soft rounded-xl p-2"
          placeholder="Ask AI..."
        />

      </aside>

    </div>
  );
}
