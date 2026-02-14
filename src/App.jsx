import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SalesPropagationUI from './comp1'  
import Login from './components/Login'
import InventoryDashboard from './components/Inventory'
import PropagationPanel from './components/Propogation'
import RequestsPanel from './components/Requests'
import RouteOptimizer from './components/Route' 
import TrackingPanel from './components/Track'  
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import DashboardDelivery from './components/DashboardDelivery'

function App() {
  const [count, setCount] = useState('dashboard-delivery') 

  return (
    <>
      {count === 'dashboard-delivery' && <DashboardDelivery activePage={count} onNavigate={setCount} /> }
      {count === 'dashboard' && <Dashboard activePage={count} onNavigate={setCount} /> }
      {count === 'sidebar' && <Sidebar activePage={count} onNavigate={setCount} />  }
      {count == 'navbar' && <Navbar activePage={count} onNavigate={setCount} /> }
      {count === 'inventory' && <InventoryDashboard />}
      {count === 'login' && <Login />}
      {count === 'sales' && <SalesPropagationUI />}
      {count === 'propagation' && <PropagationPanel />}
      {count === 'requests' && <RequestsPanel />}
      {count === 'route' && <RouteOptimizer />}
      {count === 'tracking' && <TrackingPanel />}

    
     
    </>
  )
}

export default App
