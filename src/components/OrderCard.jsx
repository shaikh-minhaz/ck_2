import React, { useState, useEffect } from 'react';
import { 
  Check, Clock, User, Phone, MapPin, Printer, AlertCircle, ChevronRight, XCircle, ArrowRight, Flame, PackageCheck, Bike, CheckCircle2 
} from 'lucide-react';

export default function OrderCard({ order, onUpdateStatus, onPrintReceipt }) {
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    const createdTime = new Date(order.createdAt).getTime();
    const updateElapsed = () => {
      const diff = Math.floor((Date.now() - createdTime) / 1000);
      setElapsedSecs(diff >= 0 ? diff : 0);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const formatElapsed = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const getPlatformStyle = (platform) => {
    switch (platform) {
      case 'zomato':
        return { bg: '#E23744', text: '#FFF', label: 'ZOMATO' };
      case 'swiggy':
        return { bg: '#FF6B35', text: '#FFF', label: 'SWIGGY' };
      default:
        return { bg: '#10B981', text: '#FFF', label: 'DIRECT APP' };
    }
  };

  const getStatusBanner = (status) => {
    switch (status) {
      case 'new':
        return { text: '⚡ NEW ORDER - TAP ACCEPT', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' };
      case 'preparing':
        return { text: '🔥 COOKING IN KITCHEN', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'ready':
        return { text: '📦 PACKED & READY FOR PICKUP', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' };
      case 'out_for_delivery':
        return { text: '🛵 OUT FOR DELIVERY', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' };
      case 'completed':
        return { text: '✅ DELIVERED SUCCESSFULLY', color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' };
      case 'cancelled':
        return { text: '❌ ORDER REJECTED / CANCELLED', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' };
      default:
        return { text: 'ORDER IN PROGRESS', color: 'var(--accent-primary)', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  const plat = getPlatformStyle(order.platform);
  const statusBanner = getStatusBanner(order.status);

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        border: order.status === 'new' ? '2px solid var(--status-new)' : order.status === 'cancelled' ? '2px solid var(--status-cancelled)' : '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        opacity: order.status === 'cancelled' ? 0.6 : 1,
        minHeight: '420px'
      }}
    >
      {/* Top Header: Platform Tag + Order ID + Timer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 900,
              background: plat.bg,
              color: plat.text,
              letterSpacing: '0.04em'
            }}
          >
            {plat.label}
          </span>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FFF' }}>
            #{order.id}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: elapsedSecs > (order.prepTimeMins * 60) ? '#EF4444' : '#FF7A00', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <Clock size={14} color="#FF7A00" />
          <span>{formatElapsed(elapsedSecs)}</span>
        </div>
      </div>

      {/* Stage Status Sub-Header Banner */}
      <div
        style={{
          background: statusBanner.bg,
          color: statusBanner.color,
          border: `1px solid ${statusBanner.color}`,
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '0.72rem',
          fontWeight: 800,
          textAlign: 'center',
          letterSpacing: '0.04em',
          textDecoration: order.status === 'cancelled' ? 'line-through' : 'none'
        }}
      >
        {statusBanner.text}
      </div>

      {/* Customer & Delivery Info */}
      <div style={{ background: '#121215', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#FFF' }}>
            <User size={15} color="#FF7A00" />
            <span>{order.customerName}</span>
          </div>
          <a href={`tel:${order.phone}`} style={{ color: '#FF7A00', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255, 87, 34, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
            <Phone size={12} />
            {order.phone}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
          <MapPin size={14} color="var(--text-dim)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {order.address}
          </span>
        </div>
      </div>

      {/* Special Kitchen Note (if present) */}
      {order.notes && (
        <div style={{ background: 'rgba(245, 158, 11, 0.12)', borderLeft: '3px solid #F59E0B', padding: '6px 10px', borderRadius: '4px', fontSize: '0.76rem', color: '#FCD34D' }}>
          <strong>Special Note:</strong> {order.notes}
        </div>
      )}

      {/* Food Items List - Warm Flame Orange Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
          Items to Prepare ({order.items.reduce((s, i) => s + i.quantity, 0)} total items):
        </div>

        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--accent-primary)', color: '#FFF', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                {item.quantity}x
              </span>
              <span style={{ color: '#FFF', fontWeight: 700 }}>{item.name}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Pricing Summary Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.84rem', marginTop: 'auto' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Net Payout: </span>
          <span style={{ color: '#059669', fontWeight: 800 }}>₹{order.netRevenue}</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFF' }}>
          Bill Total: ₹{order.subtotal}
        </div>
      </div>

      {/* Action Buttons Section - Consistent Bottom Layout */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px' }}>
        {/* Active Orders - Print Left + Actions Right */}
        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            {/* Left: Print Button */}
            <button
              onClick={() => onPrintReceipt(order)}
              title="Print KOT Receipt"
              style={{
                padding: '10px 14px', borderRadius: '6px', background: 'var(--bg-card)',
                border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600,
                whiteSpace: 'nowrap', flex: '0 0 auto'
              }}
            >
              <Printer size={16} />
              Print
            </button>

            {/* Right: Status Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
              {order.status === 'new' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                    style={{
                      padding: '10px 14px', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)', color: '#dc2626', fontWeight: 600,
                      fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order.id, 'preparing')}
                    style={{
                      padding: '10px 16px', borderRadius: '6px', background: 'var(--status-new)',
                      border: 'none', color: '#FFF', fontWeight: 700,
                      fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Accept <ArrowRight size={14} />
                  </button>
                </>
              )}

              {order.status === 'preparing' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'ready')}
                  style={{
                    padding: '10px 16px', borderRadius: '6px', background: 'var(--status-prep)',
                    border: 'none', color: '#FFF', fontWeight: 700,
                    fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Mark Ready <Check size={14} />
                </button>
              )}

              {order.status === 'ready' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                  style={{
                    padding: '10px 16px', borderRadius: '6px', background: 'var(--status-ready)',
                    border: 'none', color: '#FFF', fontWeight: 700,
                    fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Dispatch <ArrowRight size={14} />
                </button>
              )}

              {order.status === 'out_for_delivery' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                  style={{
                    padding: '10px 16px', borderRadius: '6px', background: 'var(--status-completed)',
                    border: 'none', color: '#FFF', fontWeight: 700,
                    fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Complete <Check size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completed/Cancelled Orders - Print Only Centered */}
        {(order.status === 'cancelled' || order.status === 'completed') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => onPrintReceipt(order)}
              title="Print Receipt"
              style={{
                padding: '10px 16px', borderRadius: '6px', background: 'var(--bg-card)',
                border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600
              }}
            >
              <Printer size={16} />
              Print Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
