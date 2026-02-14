import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SalesPropagationUI from "./comp1";
import Login from "./Pages/Login";
import InventoryDashboard from "./Pages/Inventory";
import PropagationPanel from "./Pages/Propogation";
import RequestsPanel from "./Pages/Requests";
import RouteOptimizer from "./Pages/Route";
import TrackingPanel from "./Pages/Track";
import DeliveryHistory from "./Pages/DeliveryHistory";
import DeliveryOrders from "./Pages/DeliveryOrders";
import DeliveryCustomers from "./Pages/DeliveryCustomers";
import CustomerApp from "./Pages/CustomerApp";

function App() {
  const [count, setCount] = useState("route");

  return (
    <>
      {count === "inventory" && <InventoryDashboard />}
      {count === "login" && <Login />}
      {count === "sales" && <SalesPropagationUI />}
      {count === "propagation" && <PropagationPanel />}
      {count === "requests" && <RequestsPanel />}
      {count === "route" && <RouteOptimizer />}
      {count === "tracking" && <TrackingPanel />}
      {count === "DeliveryHistory" && <DeliveryHistory />}
      {count === "DeliveryOrders" && <DeliveryOrders />}
      {count === "DeliveryCustomers" && <DeliveryCustomers />}
      {count === "CustomerApp" && <CustomerApp />}
    </>
  );
}

export default App;
