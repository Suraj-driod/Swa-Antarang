# Swa-Antarang 🌐

<div align="center">

  <img src="public/logo.png" alt="Swa-Antarang Logo" width="120" />

  ### The Operating Layer for Local Commerce

  **Merchants Broadcast. Drivers Move. Customers Discover.**
  
  *One interoperable ecosystem to unify fragmented local supply chains.*

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

</div>

---

## 🚀 Overview

**Swa-Antarang** is a revolutionary platform designed to break the silos of local commerce. By creating a shared digital infrastructure, it allows merchants to broadcast real-time inventory, drivers to optimize their routes and earnings, and customers to discover and track local goods seamlessly.

No more manual coordination. No more fragmented systems. Just one unified protocol for everyone.

---

## ✨ Key Features by Role

### 🏬 For Merchants (Merchant OS)
*   **Integrated Dashboard**: A command center for your business operations.
*   **Inventory Broadcasting**: Push your stock availability to the entire network instantly.
*   **Order Management**: View and process incoming orders (`Requests`) efficiently.
*   **Live Tracking**: Monitor deliveries from your store to the customer's doorstep.
*   **Propogation**: Expand your reach with smart network broadcasting.

### 🚚 For Drivers (Driver Hub)
*   **Smart Delivery Dashboard**: Optimized view for managing active deliveries.
*   **Job Discovery**: See available delivery requests (`DeliveryOrders`) matched to your location and vehicle.
*   **Performance Tracking**: Track your earnings and trip history (`DeliveryHistory`).
*   **Integrated Maps**: Navigation built specifically for local logistics.

### 🛍️ For Customers (Shop Local)
*   **Unified Discovery**: Browse products from all local merchants in one app (`CustomerApp`).
*   **Real-time Availability**: See what's actually in stock nearby.
*   **Seamless Ordering**: Direct connection to the local supply chain.

---

## 🛠️ Technology Stack

This project is built with a modern, high-performance stack focused on speed and user experience.

*   **Frontend Framework**: [React](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Lightning fast HMR)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first, responsive design)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Silky smooth transitions)
*   **Maps & Geolocation**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
*   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏁 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/Swa-Antarang.git
    cd Swa-Antarang
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 📂 Project Structure

A glimpse into how we organize our code:

```
src/
├── app/               # App-wide configurations (Router, Providers, Layouts)
├── components/        # Reusable UI components (Navbar, Maps, etc.)
├── features/          # Feature-based modules
│   ├── merchant/      # Merchant-specific logic & views
│   ├── driver/        # Driver-specific logic & views
│   └── customer/      # Customer-specific logic & views
├── pages/             # Route pages (Landing, Profile, etc.)
├── services/          # API services and helpers
└── theme/             # Theming configurations
```

---

## 🤝 Contributing

We welcome contributions to make Swa-Antarang better! Please feel free to submit a Pull Request.

---

<div align="center">
  <p>Built with ❤️ for Local Commerce</p>
  <p>&copy; 2026 Swa-Antarang</p>
</div> 