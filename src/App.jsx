import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SalesPropagationUI from "./comp1";
import Login from "./components/Login";
import InventoryDashboard from "./components/Inventory";
import PropagationPanel from "./components/Propogation";
import RequestsPanel from "./components/Requests";
import RouteOptimizer from "./components/Route";
import TrackingPanel from "./components/Track";
import DeliveryHistory from "./components/DeliveryHistory";
import DeliveryOrders from "./components/DeliveryOrders";
import DeliveryCustomers from "./components/DeliveryCustomers";
import CustomerApp from "./components/CustomerApp";

function App() {
  const [count, setCount] = useState("CustomerApp");

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
