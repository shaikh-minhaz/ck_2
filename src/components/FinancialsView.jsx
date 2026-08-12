import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  DollarSign, TrendingUp, TrendingDown, Plus, FileText, X, Wallet, ShieldCheck, ArrowUpRight 
} from 'lucide-react';

export default function FinancialsView() {
  const { orders, expenses, addExpense } = useKitchen();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // New Expense state
  const [newExp, setNewExp] = useState({
    title: '',
    category: 'Utilities',
    amount: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const validOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'new');

  const grossSales = validOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const aggregatorCommissions = validOrders.reduce((sum, o) => sum + o.commission, 0);
  const estimatedCOGS = Math.round(grossSales * 0.32); // ~32% estimated raw ingredient COGS
  const totalOperatingExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const totalDeductions = aggregatorCommissions + estimatedCOGS + totalOperatingExpenses;
  const netProfit = grossSales - totalDeductions;
  const profitMarginPercent = grossSales > 0 ? ((netProfit / grossSales) * 100).toFixed(1) : '0';

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.amount) return;
    addExpense({
      ...newExp,
      amount: Number(newExp.amount)
    });
    setShowExpenseModal(false);
    setNewExp({ title: '', category: 'Utilities', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Revenue & Financial P&L Ledger</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time net profit margin, platform commissions, and operating expenses</p>
        </div>

        <button
          onClick={() => setShowExpenseModal(true)}
          style={{
            padding: '8px 16px', borderRadius: '6px', background: 'var(--accent-direct)',
            border: 'none', color: '#FFF', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <Plus size={16} /> Log Kitchen Expense
        </button>
      </div>

      {/* P&L Financial Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Food Sales</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>₹{grossSales.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>100% Topline Revenue</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platform Commissions</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B6B', marginTop: '4px' }}>- ₹{aggregatorCommissions.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Zomato & Swiggy cuts</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Raw Material Cost (COGS)</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FDBA74', marginTop: '4px' }}>- ₹{estimatedCOGS.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Ingredients & Spice recipes</span>
        </div>

        <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.08)' }}>
          <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 700 }}>Net Kitchen Operating Profit</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: netProfit >= 0 ? '#10B981' : '#EF4444', marginTop: '4px' }}>
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800 }}>
            {profitMarginPercent}% Net Margin
          </span>
        </div>
      </div>

      {/* P&L Breakdown Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Profit & Loss (P&L) Ledger Statement</h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Current Accounting Period</span>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            {/* Sales */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: '#FFF' }}>1. Total Gross Revenue</span>
              <strong style={{ color: '#FFF' }}>₹{grossSales.toLocaleString('en-IN')}</strong>
            </div>

            {/* Deductions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', paddingLeft: '16px' }}>
              <span>a. Zomato & Swiggy Platform Commissions</span>
              <span style={{ color: '#F87171' }}>- ₹{aggregatorCommissions.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', paddingLeft: '16px' }}>
              <span>b. Raw Material Ingredients (COGS)</span>
              <span style={{ color: '#FDBA74' }}>- ₹{estimatedCOGS.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', paddingLeft: '16px' }}>
              <span>c. Total Fixed & Operating Kitchen Expenses</span>
              <span style={{ color: '#F87171' }}>- ₹{totalOperatingExpenses.toLocaleString('en-IN')}</span>
            </div>

            {/* Net Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-color)', paddingTop: '12px', marginTop: '6px', fontSize: '1.05rem' }}>
              <span style={{ fontWeight: 800, color: '#10B981' }}>Net Profit / (Loss)</span>
              <strong style={{ color: netProfit >= 0 ? '#10B981' : '#EF4444', fontSize: '1.15rem' }}>
                ₹{netProfit.toLocaleString('en-IN')} ({profitMarginPercent}%)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses History Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Kitchen Expense Ledger</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Date</th>
              <th style={{ padding: '12px 20px' }}>Expense Description</th>
              <th style={{ padding: '12px 20px' }}>Category</th>
              <th style={{ padding: '12px 20px' }}>Notes</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{exp.date}</td>
                <td style={{ padding: '12px 20px', fontWeight: 700, color: '#FFF' }}>{exp.title}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '0.72rem', fontWeight: 700 }}>
                    {exp.category}
                  </span>
                </td>
                <td style={{ padding: '12px 20px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>{exp.notes || '-'}</td>
                <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 800, color: '#EF4444' }}>
                  ₹{Number(exp.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form
            onSubmit={handleCreateExpense}
            className="glass-panel"
            style={{ width: '420px', padding: '24px', position: 'relative', background: '#121722' }}
          >
            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
              Log Kitchen Expense
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Gas Refill"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#181F2E', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  >
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities (Gas/Electricity)</option>
                    <option value="Salaries">Staff Salaries</option>
                    <option value="Packaging">Packaging Boxes</option>
                    <option value="Maintenance">Maintenance & Repairs</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2400"
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notes / Vendor Invoice</label>
                <input
                  type="text"
                  placeholder="e.g. HP Gas Bill #4021"
                  value={newExp.notes}
                  onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ marginTop: '10px', padding: '12px', background: 'var(--accent-direct)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Log Expense Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
