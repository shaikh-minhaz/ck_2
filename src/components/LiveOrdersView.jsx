import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import OrderCard from './OrderCard';
import { 
  Bell, Flame, PackageCheck, Bike, CheckCircle2, Filter, Search, Printer, X, Sparkles, LayoutGrid, ListFilter, HelpCircle, ArrowRight
} from 'lucide-react';

export default function LiveOrdersView() {
  const { orders, updateOrderStatus } = useKitchen();
  const [activeStageTab, setActiveStageTab] = useState('new'); // 'new', 'preparing', 'ready', 'out_for_delivery', 'completed', 'all'
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' (simplified focused view) or 'columns' (kanban)
  const [showGuide, setShowGuide] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Counts by status
  const countNew = orders.filter((o) => o.status === 'new').length;
  const countPrep = orders.filter((o) => o.status === 'preparing').length;
  const countReady = orders.filter((o) => o.status === 'ready').length;
  const countDelivery = orders.filter((o) => o.status === 'out_for_delivery').length;
  const countCompleted = orders.filter((o) => o.status === 'completed').length;

  // Filter orders by status stage, platform, and search query
  const filteredOrders = orders.filter((ord) => {
    const matchesStage = activeStageTab === 'all' || ord.status === activeStageTab;
    const matchesPlatform = platformFilter === 'all' || ord.platform === platformFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phone.includes(searchQuery);
    return matchesStage && matchesPlatform && matchesSearch;
  });

  const handlePrint = (order) => {
    setSelectedReceiptOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const columns = [
    {
      key: 'new',
      title: 'New Orders',
      icon: Bell,
      color: '#FF5722',
      badgeBg: 'rgba(255, 87, 34, 0.2)',
      orders: orders.filter((o) => o.status === 'new')
    },
    {
      key: 'preparing',
      title: 'Preparing / Cooking',
      icon: Flame,
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      orders: orders.filter((o) => o.status === 'preparing')
    },
    {
      key: 'ready',
      title: 'Ready for Pickup',
      icon: PackageCheck,
      color: '#A855F7',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      orders: orders.filter((o) => o.status === 'ready')
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      icon: Bike,
      color: '#06B6D4',
      badgeBg: 'rgba(6, 182, 212, 0.2)',
      orders: orders.filter((o) => o.status === 'out_for_delivery')
    },
    {
      key: 'completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      orders: orders.filter((o) => o.status === 'completed')
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      
      {/* Friendly Warm Kitchen Guide Banner */}
      {showGuide && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '12px',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF7A00', fontWeight: 800 }}>
              <HelpCircle size={18} />
              <span>Kitchen Order Workflow:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F4F4F5', fontWeight: 600 }}>
              <span style={{ background: 'rgba(255, 87, 34, 0.2)', color: '#FF8A65', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Step 1: New Order</span>
              <ArrowRight size={14} color="var(--text-muted)" />
              <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Step 2: Accept & Cook</span>
              <ArrowRight size={14} color="var(--text-muted)" />
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#D8B4FE', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Step 3: Mark Ready</span>
              <ArrowRight size={14} color="var(--text-muted)" />
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Step 4: Dispatch to Rider</span>
            </div>
          </div>

          <button
            onClick={() => setShowGuide(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Dismiss guide"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Interactive Status Summary Cards (Warm Dark Theme) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        
        {/* New Orders Card */}
        <button
          onClick={() => setActiveStageTab('new')}
          style={{
            background: activeStageTab === 'new' ? 'rgba(220, 38, 38, 0.15)' : 'var(--bg-card)',
            border: activeStageTab === 'new' ? '2px solid #dc2626' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#dc2626', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>1. New Orders</span>
            <Bell size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span>{countNew}</span>
            {countNew > 0 && <span style={{ fontSize: '0.65rem', background: '#dc2626', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>ACTION</span>}
          </div>
        </button>

        {/* Preparing Card */}
        <button
          onClick={() => setActiveStageTab('preparing')}
          style={{
            background: activeStageTab === 'preparing' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
            border: activeStageTab === 'preparing' ? '2px solid #f59e0b' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>2. Preparing</span>
            <Flame size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {countPrep}
          </div>
        </button>

        {/* Ready for Pickup Card */}
        <button
          onClick={() => setActiveStageTab('ready')}
          style={{
            background: activeStageTab === 'ready' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
            border: activeStageTab === 'ready' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8b5cf6', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>3. Ready</span>
            <PackageCheck size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {countReady}
          </div>
        </button>

        {/* Out for Delivery Card */}
        <button
          onClick={() => setActiveStageTab('out_for_delivery')}
          style={{
            background: activeStageTab === 'out_for_delivery' ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-card)',
            border: activeStageTab === 'out_for_delivery' ? '2px solid #06b6d4' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#06b6d4', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>4. Delivery</span>
            <Bike size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {countDelivery}
          </div>
        </button>

        {/* Completed Card */}
        <button
          onClick={() => setActiveStageTab('completed')}
          style={{
            background: activeStageTab === 'completed' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-card)',
            border: activeStageTab === 'completed' ? '2px solid #059669' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#059669', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>5. Completed</span>
            <CheckCircle2 size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {countCompleted}
          </div>
        </button>

        {/* All Active Tab */}
        <button
          onClick={() => setActiveStageTab('all')}
          style={{
            background: activeStageTab === 'all' ? 'var(--accent-primary)' : 'var(--bg-card)',
            border: activeStageTab === 'all' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: activeStageTab === 'all' ? '#FFF' : 'var(--text-main)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>All Orders</span>
            <Sparkles size={16} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: activeStageTab === 'all' ? '#FFF' : 'var(--text-main)' }}>
            {orders.length}
          </div>
        </button>

      </div>

      {/* Controls Bar: Search + Platform Filter + View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#131317', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        
        {/* Left: View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Layout Style:</span>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('tabs')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: viewMode === 'tabs' ? '#FF5722' : 'transparent',
                color: viewMode === 'tabs' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <ListFilter size={14} /> Simple View (Recommended)
            </button>
            <button
              onClick={() => setViewMode('columns')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: viewMode === 'columns' ? '#FF5722' : 'transparent',
                color: viewMode === 'columns' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <LayoutGrid size={14} /> Multi-Column Board
            </button>
          </div>
        </div>

        {/* Right: Search & Platform Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Order ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                borderRadius: '8px',
                background: '#19191E',
                border: '1px solid var(--border-color)',
                color: '#FFF',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Platform Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setPlatformFilter('all')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: platformFilter === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: platformFilter === 'all' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.72rem'
              }}
            >
              All Platforms
            </button>
            <button
              onClick={() => setPlatformFilter('zomato')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: platformFilter === 'zomato' ? '#E23744' : 'transparent',
                color: platformFilter === 'zomato' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.72rem'
              }}
            >
              Zomato
            </button>
            <button
              onClick={() => setPlatformFilter('swiggy')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: platformFilter === 'swiggy' ? '#FF6B35' : 'transparent',
                color: platformFilter === 'swiggy' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.72rem'
              }}
            >
              Swiggy
            </button>
            <button
              onClick={() => setPlatformFilter('direct')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: platformFilter === 'direct' ? '#10B981' : 'transparent',
                color: platformFilter === 'direct' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.72rem'
              }}
            >
              Direct App
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering based on selected View Mode */}
      {viewMode === 'tabs' ? (
        /* SIMPLE STREAMLINED GRID VIEW */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Showing:</span>
              <span style={{ color: '#FF7A00' }}>
                {activeStageTab === 'new' && '🔔 New Orders (Pending Kitchen Acceptance)'}
                {activeStageTab === 'preparing' && '🔥 Orders Cooking on Stove/Oven'}
                {activeStageTab === 'ready' && '📦 Orders Packed & Ready for Pickup'}
                {activeStageTab === 'out_for_delivery' && '🛵 Orders Out for Delivery'}
                {activeStageTab === 'completed' && '✅ Completed / Delivered History'}
                {activeStageTab === 'all' && '📋 All Orders'}
              </span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total {filteredOrders.length} order(s) listed
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <Sparkles size={32} color="#FF7A00" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '4px' }}>No orders found in this section</h4>
              <p style={{ fontSize: '0.8rem' }}>Click another tab above or press "API Simulator" to generate a test order.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', paddingBottom: '20px' }}>
              {filteredOrders.map((ord) => (
                <OrderCard
                  key={ord.id}
                  order={ord}
                  onUpdateStatus={updateOrderStatus}
                  onPrintReceipt={handlePrint}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MULTI-COLUMN KANBAN BOARD VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: '20px'
          }}
        >
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.key}
                style={{
                  background: '#141418',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: 'calc(100vh - 250px)',
                  overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} color={col.color} />
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>{col.title}</h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: col.badgeBg,
                      color: col.color
                    }}
                  >
                    {col.orders.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                      No orders in this stage
                    </div>
                  ) : (
                    col.orders.map((ord) => (
                      <OrderCard
                        key={ord.id}
                        order={ord}
                        onUpdateStatus={updateOrderStatus}
                        onPrintReceipt={handlePrint}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptOrder && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
          }}
        >
          <div
            className="glass-panel"
            style={{ width: '380px', padding: '24px', position: 'relative', background: '#121215' }}
          >
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* Printable Receipt Wrapper */}
            <div id="printable-receipt" style={{ color: '#000', background: '#FFF', padding: '16px', borderRadius: '4px', fontFamily: 'monospace' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>KITCHEN PULSE OS</h2>
                <p style={{ fontSize: '0.8rem', margin: '4px 0' }}>Downtown Kitchen Hub #01</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
                  *** {selectedReceiptOrder.platform.toUpperCase()} ORDER ***
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                <div><strong>Order ID:</strong> #{selectedReceiptOrder.id}</div>
                <div><strong>Date/Time:</strong> {new Date(selectedReceiptOrder.createdAt).toLocaleTimeString()}</div>
                <div><strong>Customer:</strong> {selectedReceiptOrder.customerName} ({selectedReceiptOrder.phone})</div>
                <div><strong>Address:</strong> {selectedReceiptOrder.address}</div>
              </div>

              <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '8px 0', marginBottom: '10px' }}>
                {selectedReceiptOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>{it.quantity}x {it.name}</span>
                    <span>₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Total: ₹{selectedReceiptOrder.subtotal}
              </div>

              {selectedReceiptOrder.notes && (
                <div style={{ fontSize: '0.75rem', marginTop: '8px', borderTop: '1px solid #ccc', paddingTop: '4px' }}>
                  <strong>Special Note:</strong> {selectedReceiptOrder.notes}
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                style={{ flex: 1, padding: '10px', background: 'var(--accent-primary)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print Receipt Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
