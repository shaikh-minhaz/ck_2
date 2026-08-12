import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, ShoppingBag, Clock, DollarSign, Award, Flame, PieChart, BarChart 
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
);

export default function AnalyticsView() {
  const { orders, menu } = useKitchen();

  const validOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'new');

  // Order status counts
  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const deliveringOrders = orders.filter(o => o.status === 'out_for_delivery').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const activeOrders = newOrders + preparingOrders + readyOrders + deliveringOrders;
  
  // Order History - Only completed and cancelled orders
  const historyOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  const totalRevenue = validOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Revenue breakdown by Platform
  const zomatoRev = validOrders.filter((o) => o.platform === 'zomato').reduce((acc, o) => acc + o.subtotal, 0);
  const swiggyRev = validOrders.filter((o) => o.platform === 'swiggy').reduce((acc, o) => acc + o.subtotal, 0);
  const directRev = validOrders.filter((o) => o.platform === 'direct').reduce((acc, o) => acc + o.subtotal, 0);

  const doughnutData = {
    labels: ['Zomato Orders', 'Swiggy Orders', 'Direct Outlet'],
    datasets: [
      {
        data: [zomatoRev || 1200, swiggyRev || 950, directRev || 650],
        backgroundColor: ['#E23744', '#FC8019', '#10B981'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9CA3AF', font: { family: 'Plus Jakarta Sans', size: 12 } }
      }
    }
  };

  // Hourly Rush Bar Chart Data
  const barData = {
    labels: ['12 PM (Lunch)', '2 PM', '4 PM', '6 PM (Snacks)', '8 PM (Dinner Rush)', '10 PM'],
    datasets: [
      {
        label: 'Orders Count',
        data: [14, 22, 9, 18, 38, 25],
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        borderRadius: 6,
        hoverBackgroundColor: '#6366F1'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
      y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.06)' } }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Dish Sales Ranking
  const dishSalesMap = {};
  validOrders.forEach((ord) => {
    ord.items.forEach((it) => {
      if (!dishSalesMap[it.name]) {
        dishSalesMap[it.name] = { qty: 0, revenue: 0 };
      }
      dishSalesMap[it.name].qty += it.quantity;
      dishSalesMap[it.name].revenue += it.price * it.quantity;
    });
  });

  const rankedDishes = Object.keys(dishSalesMap)
    .map((name) => ({ name, ...dishSalesMap[name] }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Kitchen Analytics & Performance Hub</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time sales velocity, channel distribution, and rush-hour insights</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Gross Revenue</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders Processed</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>{validOrders.length} orders</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg. Order Value (AOV)</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FCD34D' }}>₹{avgOrderValue}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Prep & Handover</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#C4B5FD' }}>14.2 Mins</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Doughnut Chart - Revenue By Platform */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} color="#818CF8" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>Platform Sales Mix</h3>
          </div>
          <div style={{ width: '240px', height: '240px' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart - Peak Kitchen Rush Hours */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart size={18} color="#818CF8" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>Peak Kitchen Order Rush Heatmap</h3>
          </div>
          <div style={{ flex: 1, minHeight: '220px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Bestselling Dishes Ranking Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#f59e0b" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>Top Selling Dishes Leaderboard</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Rank</th>
              <th style={{ padding: '12px 20px' }}>Dish Name</th>
              <th style={{ padding: '12px 20px' }}>Units Sold</th>
              <th style={{ padding: '12px 20px' }}>Total Sales Earned</th>
            </tr>
          </thead>
          <tbody>
            {rankedDishes.map((dish, index) => (
              <tr key={dish.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 20px', fontWeight: 800, color: index === 0 ? '#f59e0b' : (index === 1 ? '#9ca3af' : '#FFF') }}>
                  #{index + 1}
                </td>
                <td style={{ padding: '12px 20px', fontWeight: 700, color: '#FFF' }}>
                  {dish.name}
                </td>
                <td style={{ padding: '12px 20px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {dish.qty} portions
                </td>
                <td style={{ padding: '12px 20px', fontWeight: 800, color: 'var(--accent-direct)' }}>
                  ₹{dish.revenue.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order History & Status Breakdown */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>Order History (Completed & Rejected)</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>History Records:</span>
            <strong style={{ color: '#FFF', fontSize: '0.95rem' }}>{historyOrders.length}</strong>
          </div>
        </div>

        {/* Order Status Summary Cards - Only showing Completed and Rejected */}
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Completed ✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{completedOrders}</div>
          </div>

          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Rejected ❌</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>{cancelledOrders}</div>
          </div>
        </div>

        {/* Detailed Order History Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Order ID</th>
                <th style={{ padding: '12px 20px' }}>Platform</th>
                <th style={{ padding: '12px 20px' }}>Customer</th>
                <th style={{ padding: '12px 20px' }}>Items</th>
                <th style={{ padding: '12px 20px' }}>Amount</th>
                <th style={{ padding: '12px 20px' }}>Status</th>
                <th style={{ padding: '12px 20px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No order history yet. Complete or reject some orders to see them here.
                  </td>
                </tr>
              ) : (
                historyOrders.map((order) => {
                  const platformColors = {
                    zomato: '#dc2626',
                    swiggy: '#f97316',
                    direct: '#059669'
                  };

                  const statusConfig = {
                    new: { label: 'New', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
                    preparing: { label: 'Preparing', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                    ready: { label: 'Ready', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
                    out_for_delivery: { label: 'Delivering', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
                    completed: { label: 'Completed', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
                    cancelled: { label: 'Rejected', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' }
                  };

                  const status = statusConfig[order.status] || statusConfig.new;
                  const timeDiff = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                        #{order.id}
                      </td>

                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '4px', 
                          background: `${platformColors[order.platform]}20`,
                          color: platformColors[order.platform],
                          fontSize: '0.72rem', 
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {order.platform}
                        </span>
                      </td>

                      <td style={{ padding: '12px 20px', color: 'var(--text-main)', fontSize: '0.82rem' }}>
                        {order.customerName}
                      </td>

                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>

                      <td style={{ padding: '12px 20px', fontWeight: 700, color: '#FFF' }}>
                        ₹{order.subtotal}
                      </td>

                      <td style={{ padding: '12px 20px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: status.bg,
                          color: status.color,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          border: `1px solid ${status.color}40`
                        }}>
                          {status.label}
                        </span>
                      </td>

                      <td style={{ padding: '12px 20px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        {timeDiff < 1 ? 'Just now' : timeDiff < 60 ? `${timeDiff}m ago` : `${Math.floor(timeDiff / 60)}h ago`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
