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


function App() {
  const [count, setCount] = useState('login') 

  return (
    <>
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

export default App;
