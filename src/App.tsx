import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import PaymentScreen from "./components/PaymentScreen";
import OwnerDashboard from "./components/OwnerDashboard";
import { InventoryProvider } from "./lib/useInventory";

export default function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/pay" element={<PaymentScreen />} />
          <Route path="/admin" element={<OwnerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  );
}
