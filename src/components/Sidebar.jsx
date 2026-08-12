import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  ShoppingBag, UtensilsCrossed, PackageCheck, BarChart3, 
  DollarSign, Users, AlertTriangle, ChevronRight, Flame 
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, orders, inventory, menu } = useKitchen();

  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const activePrepCount = orders.filter(o => o.status === 'new' || o.status === 'preparing').length;
  const lowStockCount = inventory.filter(i => i.stock <= i.reorderLevel).length;

  const totalSalesToday = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'new')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const navItems = [
    {
      id: 'orders',
      label: 'Live Orders',
      icon: ShoppingBag,
      badge: activePrepCount > 0 ? activePrepCount : null,
      badgeColor: newOrdersCount > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)',
      pulse: newOrdersCount > 0
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: UtensilsCrossed,
      badge: menu.length,
      badgeColor: 'rgba(255, 255, 255, 0.08)'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: PackageCheck,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: lowStockCount > 0 ? 'rgba(245, 158, 11, 0.2)' : null,
      alert: lowStockCount > 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'financials',
      label: 'Financials',
      icon: DollarSign,
      badge: null
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: null
    }
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '240px',
        height: '100vh',
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        background: 'var(--bg-sidebar)',
        zIndex: 20
      }}
    >
      <div>
        {/* Top Logo / Brand Title */}
        <div style={{ padding: '0 10px 16px 10px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={18} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>KitchenPulse</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Management Hub</span>
          </div>
        </div>

        {/* Navigation Label */}
        <div style={{ padding: '0 10px 8px 10px', fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Workspace
        </div>

        {/* Nav List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={item.pulse ? 'pulse-badge' : ''}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: item.badgeColor || 'rgba(255,255,255,0.08)',
                      color: 'var(--text-main)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Summary Box */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Today's Sales</span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>+18%</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
          ₹{totalSalesToday.toLocaleString('en-IN')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
          <span>Orders:</span>
          <strong style={{ color: 'var(--text-main)' }}>{orders.length}</strong>
        </div>
      </div>
    </aside>
  );
}
