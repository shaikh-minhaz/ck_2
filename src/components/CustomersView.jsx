import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  Users, Search, Award, Phone, Heart, ShoppingBag, Star, Crown 
} from 'lucide-react';

export default function CustomersView() {
  const { customers } = useKitchen();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.favItem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vipCount = customers.filter((c) => c.tag === 'VIP Customer' || c.totalOrders >= 10).length;
  const totalLTV = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Customer CRM & Loyalty Directory</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer ordering profiles, favorite dishes, and lifetime spend history</p>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              background: 'rgba(24, 31, 46, 0.9)',
              border: '1px solid var(--border-color)',
              color: '#FFF',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Profiles</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>{customers.length} Customers</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <Crown size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VIP Loyal Repeaters</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FCD34D' }}>{vipCount} Members</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total CRM Lifetime Value</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34D399' }}>₹{totalLTV.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Customer Relationship Ledger</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Customer Name</th>
              <th style={{ padding: '14px 20px' }}>Phone Contact</th>
              <th style={{ padding: '14px 20px' }}>Orders Placed</th>
              <th style={{ padding: '14px 20px' }}>Total Spend (LTV)</th>
              <th style={{ padding: '14px 20px' }}>Favorite Dish</th>
              <th style={{ padding: '14px 20px' }}>Loyalty Tier</th>
              <th style={{ padding: '14px 20px' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>
                  {cust.name}
                </td>

                <td style={{ padding: '14px 20px', color: '#818CF8', fontWeight: 600 }}>
                  {cust.phone}
                </td>

                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>
                  {cust.totalOrders} orders
                </td>

                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#10B981' }}>
                  ₹{cust.totalSpend.toLocaleString('en-IN')}
                </td>

                <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={13} color="#F87171" fill="#F87171" />
                    {cust.favItem}
                  </div>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  {cust.tag === 'VIP Customer' || cust.totalOrders >= 10 ? (
                    <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.72rem', fontWeight: 800 }}>
                      VIP ⭐
                    </span>
                  ) : (
                    <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>
                      {cust.tag || 'Regular'}
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 20px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                  {cust.lastOrder || 'Recent'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
