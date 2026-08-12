import React, { useState } from 'react';
import { KitchenProvider, useKitchen } from './context/KitchenContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LiveOrdersView from './components/LiveOrdersView';
import MenuView from './components/MenuView';
import InventoryView from './components/InventoryView';
import AnalyticsView from './components/AnalyticsView';
import FinancialsView from './components/FinancialsView';
import CustomersView from './components/CustomersView';
import AggregatorSimulatorModal from './components/AggregatorSimulatorModal';
import NewOrderModal from './components/NewOrderModal';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

function KitchenApp() {
  const { activeTab, toastNotification } = useKitchen();
  const [showSimModal, setShowSimModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'orders':
        return <LiveOrdersView />;
      case 'menu':
        return <MenuView />;
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'financials':
        return <FinancialsView />;
      case 'customers':
        return <CustomersView />;
      default:
        return <LiveOrdersView />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="main-content">
        <Header 
          onOpenNewOrderModal={() => setShowNewOrderModal(true)} 
          onOpenSimModal={() => setShowSimModal(true)} 
        />

        <main className="page-body">
          {renderCurrentTab()}
        </main>
      </div>

      {/* Floating Toast Notification Banner */}
      {toastNotification && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: toastNotification.type === 'warning' ? '#7C2D12' : (toastNotification.type === 'success' ? '#064E3B' : '#1E1B4B'),
            border: `1px solid ${toastNotification.type === 'warning' ? '#f59e0b' : (toastNotification.type === 'success' ? '#059669' : 'var(--accent-primary)')}`,
            color: '#FFF',
            fontSize: '0.85rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toastNotification.type === 'warning' && <AlertTriangle size={18} color="#FBBF24" />}
          {toastNotification.type === 'success' && <CheckCircle size={18} color="#34D399" />}
          {toastNotification.type === 'info' && <Info size={18} color="#818CF8" />}
          <span>{toastNotification.message}</span>
        </div>
      )}

      {/* API Simulator Modal */}
      {showSimModal && (
        <AggregatorSimulatorModal onClose={() => setShowSimModal(false)} />
      )}

      {/* Manual New Order Modal */}
      {showNewOrderModal && (
        <NewOrderModal onClose={() => setShowNewOrderModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <KitchenProvider>
      <KitchenApp />
    </KitchenProvider>
  );
}
