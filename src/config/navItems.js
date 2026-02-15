import {
  LayoutDashboard,
  Package,
  Radio,
  MessageSquare,
  MapPin,
  ClipboardList,
  Clock,
  Map,
  Home,
  ShoppingBag,
  Navigation,
} from 'lucide-react';

export const merchantNavItems = [
  { to: '/merchant/Dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/merchant/Inventory', icon: Package, label: 'Inventory' },
  { to: '/merchant/Propogation', icon: Radio, label: 'Propagate' },
  { to: '/merchant/Requests', icon: MessageSquare, label: 'Requests', badge: true },
  { to: '/merchant/Track', icon: MapPin, label: 'Track' },
  { to: '/merchant/Route', icon: Navigation, label: 'Route' },
];

export const driverNavItems = [
  { to: '/driver/DashboardDelivery', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/driver/DashboardOrders', icon: ClipboardList, label: 'Orders' },
  { to: '/driver/DashboardHistory', icon: Clock, label: 'History' },
  { to: '/driver/maps', icon: Map, label: 'Maps' },
];

export const customerNavItems = [
  { to: '/customer/CustomerApp', icon: Home, label: 'Browse Products' },
  { to: '/customer/CustomerApp?view=cart', icon: ShoppingBag, label: 'My Cart' },
  { to: '/customer/CustomerApp?view=tracking', icon: Clock, label: 'Orders & Tracking' },
];

export const roleNavMap = {
  merchant: merchantNavItems,
  driver: driverNavItems,
  customer: customerNavItems,
};
