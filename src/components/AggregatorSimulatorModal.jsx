import React, { useState, useEffect } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  Radio, Play, Square, Zap, X, Code, CheckCircle, AlertCircle, Settings 
} from 'lucide-react';

const DUMMY_CUSTOMERS = [
  { name: 'Rohan Mehra', phone: '+91 98110 99887', address: 'Tower B, DLF Cyber City, Sector 24' },
  { name: 'Simran Kaur', phone: '+91 97123 44556', address: 'Apartment 504, Golf Course Road' },
  { name: 'Vikramaditya S.', phone: '+91 99988 77665', address: 'Plot 88, Udyog Vihar Phase 4' },
  { name: 'Neha Chawla', phone: '+91 98711 22334', address: 'Sushant Lok 2, Block E' }
];

export default function AggregatorSimulatorModal({ onClose }) {
  const { 
    aggregators, 
    toggleAggregatorStatus, 
    addOrder, 
    simulating, 
    setSimulating, 
    menu,
    showToast
  } = useKitchen();

  const [intervalSecs, setIntervalSecs] = useState(25);
  const [activeJson, setActiveJson] = useState(null);

  // Auto order generator effect
  useEffect(() => {
    let timer = null;
    if (simulating) {
      timer = setInterval(() => {
        triggerRandomOrder();
      }, intervalSecs * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simulating, intervalSecs, menu, aggregators]);

  const triggerRandomOrder = (platformOverride = null) => {
    const onlinePlatforms = Object.keys(aggregators).filter((k) => aggregators[k].online);
    if (onlinePlatforms.length === 0) {
      showToast('No platforms are online! Turn on Zomato/Swiggy/Direct first.', 'warning');
      return;
    }

    const platform = platformOverride || onlinePlatforms[Math.floor(Math.random() * onlinePlatforms.length)];
    
    // Check if platform is online
    if (!aggregators[platform] || !aggregators[platform].online) {
      showToast(`${platform.charAt(0).toUpperCase() + platform.slice(1)} platform is currently offline!`, 'warning');
      return;
    }

    const availableMenu = menu.filter((m) => m.isAvailable && m.platforms[platform]);

    if (availableMenu.length === 0) {
      showToast(`No menu items available for ${platform.charAt(0).toUpperCase() + platform.slice(1)}! Enable some dishes first.`, 'warning');
      return;
    }

    // Pick 1-2 random items
    const count = Math.floor(Math.random() * 2) + 1;
    const selectedItems = [];
    for (let i = 0; i < count; i++) {
      const item = availableMenu[Math.floor(Math.random() * availableMenu.length)];
      selectedItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: Math.floor(Math.random() * 2) + 1
      });
    }

    const randomCust = DUMMY_CUSTOMERS[Math.floor(Math.random() * DUMMY_CUSTOMERS.length)];

    const orderPayload = {
      platform,
      customerName: randomCust.name,
      phone: randomCust.phone,
      address: randomCust.address,
      items: selectedItems,
      notes: Math.random() > 0.6 ? 'Please send extra napkins & green chutney.' : ''
    };

    const created = addOrder(orderPayload);
    if (created) {
      setActiveJson(created);
      showToast(`✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} order created: #${created.id}`, 'success');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
      }}
    >
      <div
        className="glass-panel"
        style={{ width: '680px', maxWidth: '95vw', padding: '24px', position: 'relative', background: '#121722', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
              <Radio size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Zomato & Swiggy API Simulator</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Simulate real-time partner API webhooks and channel order popups</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Auto Order Simulation Switch */}
        <div style={{ background: 'rgba(24, 31, 46, 0.9)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Auto Order Injection Engine</span>
              {simulating ? (
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 800 }}>RUNNING 🟢</span>
              ) : (
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontWeight: 800 }}>PAUSED 🔴</span>
              )}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Injects simulated Zomato/Swiggy orders automatically into your kitchen pipeline.
            </p>
          </div>

          <button
            onClick={() => setSimulating(!simulating)}
            style={{
              padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: simulating ? 'rgba(220, 38, 38, 0.15)' : 'var(--accent-direct)',
              color: simulating ? '#dc2626' : '#FFF', fontWeight: 700, fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {simulating ? <Square size={14} /> : <Play size={14} />}
            {simulating ? 'Stop Simulator' : 'Start Auto Orders'}
          </button>
        </div>

        {/* Instant Manual Triggers */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Instant Webhook Order Triggers:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button
              onClick={() => triggerRandomOrder('zomato')}
              style={{
                padding: '12px', borderRadius: '10px', background: 'rgba(226, 55, 68, 0.15)',
                border: '1px solid #E23744', color: '#FF6B6B', fontWeight: 800, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Zap size={16} /> Fire Zomato Order
            </button>

            <button
              onClick={() => triggerRandomOrder('swiggy')}
              style={{
                padding: '12px', borderRadius: '10px', background: 'rgba(252, 128, 25, 0.15)',
                border: '1px solid #FC8019', color: '#FDBA74', fontWeight: 800, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Zap size={16} /> Fire Swiggy Order
            </button>

            <button
              onClick={() => triggerRandomOrder('direct')}
              style={{
                padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981', color: '#6EE7B7', fontWeight: 800, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Zap size={16} /> Fire Direct Order
            </button>
          </div>
        </div>

        {/* Aggregator Webhook Endpoints Inspection */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Code size={14} /> Aggregator Integration Endpoints:
          </div>
          <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#818CF8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><span style={{ color: '#E23744' }}>POST</span> https://api.kitchenpulse.io/v1/webhooks/zomato <span style={{ color: '#10B981' }}>200 OK</span></div>
            <div><span style={{ color: '#FC8019' }}>POST</span> https://api.kitchenpulse.io/v1/webhooks/swiggy <span style={{ color: '#10B981' }}>200 OK</span></div>
          </div>
        </div>

        {/* Payload Inspector */}
        {activeJson && (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Latest Triggered Webhook Payload:
            </div>
            <pre style={{ background: '#090D14', color: '#34D399', padding: '12px', borderRadius: '8px', fontSize: '0.72rem', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
              {JSON.stringify(activeJson, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
