import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  X, Plus, Minus, ShoppingBag, User, Phone, MapPin, Check 
} from 'lucide-react';

export default function NewOrderModal({ onClose }) {
  const { menu, addOrder } = useKitchen();

  const [platform, setPlatform] = useState('direct');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Selected items map: { itemId: quantity }
  const [cart, setCart] = useState({});

  const updateQuantity = (dishId, delta) => {
    setCart((prev) => {
      const current = prev[dishId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return { ...prev, [dishId]: next };
    });
  };

  const selectedItemsList = Object.keys(cart).map((id) => {
    const dish = menu.find((m) => m.id === id);
    return {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: cart[id]
    };
  });

  const grandTotal = selectedItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) return;

    addOrder({
      platform,
      customerName: customerName || 'Walk-in / Direct Call Customer',
      phone: phone || '+91 98000 00000',
      address: address || 'Kitchen Takeaway Counter',
      items: selectedItemsList,
      notes,
      prepTimeMins: 15
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
      }}
    >
      <form
        onSubmit={handleSubmitOrder}
        className="glass-panel"
        style={{ width: '600px', maxWidth: '95vw', padding: '24px', position: 'relative', background: '#121722', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} color="#818CF8" /> Create Manual Order (Direct / Phone / Takeaway)
        </h2>

        {/* Order Channel Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Order Source Channel</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setPlatform('direct')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                background: platform === 'direct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(24,31,46,0.6)',
                border: `1px solid ${platform === 'direct' ? '#10B981' : 'var(--border-color)'}`,
                color: platform === 'direct' ? '#6EE7B7' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem'
              }}
            >
              Direct Outlet 🟢
            </button>
            <button
              type="button"
              onClick={() => setPlatform('zomato')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                background: platform === 'zomato' ? 'rgba(226, 55, 68, 0.2)' : 'rgba(24,31,46,0.6)',
                border: `1px solid ${platform === 'zomato' ? '#E23744' : 'var(--border-color)'}`,
                color: platform === 'zomato' ? '#FF6B6B' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem'
              }}
            >
              Zomato Call 🔴
            </button>
            <button
              type="button"
              onClick={() => setPlatform('swiggy')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                background: platform === 'swiggy' ? 'rgba(252, 128, 25, 0.2)' : 'rgba(24,31,46,0.6)',
                border: `1px solid ${platform === 'swiggy' ? '#FC8019' : 'var(--border-color)'}`,
                color: platform === 'swiggy' ? '#FDBA74' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem'
              }}
            >
              Swiggy Call 🟠
            </button>
          </div>
        </div>

        {/* Customer Info Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Malhotra"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</label>
            <input
              type="text"
              required
              placeholder="e.g. +91 98765 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivery Address</label>
          <input
            type="text"
            placeholder="e.g. Flat 302, Palm Towers, DLF Phase 1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
          />
        </div>

        {/* Menu Item Picker */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Select Dishes to Order:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            {menu.filter(m => m.isAvailable).map((dish) => {
              const qty = cart[dish.id] || 0;
              return (
                <div key={dish.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{dish.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>₹{dish.price}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.id, -1)}
                      style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#181F2E', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 800, minWidth: '18px', textAlign: 'center', color: '#818CF8' }}>{qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.id, 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '4px', border: 'none', background: 'var(--accent-primary)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payable: </span>
            <strong style={{ fontSize: '1.2rem', color: '#10B981', marginLeft: '6px' }}>₹{grandTotal}</strong>
          </div>

          <button
            type="submit"
            disabled={selectedItemsList.length === 0}
            style={{
              padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: selectedItemsList.length === 0 ? 'not-allowed' : 'pointer',
              background: selectedItemsList.length === 0 ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)',
              color: '#FFF', fontWeight: 700, fontSize: '0.85rem'
            }}
          >
            Dispatch Order to Kitchen
          </button>
        </div>
      </form>
    </div>
  );
}
