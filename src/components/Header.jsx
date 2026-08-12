import React, { useState, useEffect } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  Volume2, VolumeX, Flame, Zap, Plus, RefreshCw, Radio, Clock, ShieldCheck 
} from 'lucide-react';

export default function Header({ onOpenNewOrderModal, onOpenSimModal }) {
  const { 
    aggregators, 
    toggleAggregatorStatus, 
    soundEnabled, 
    setSoundEnabled, 
    orders, 
    resetDemoData 
  } = useKitchen();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeNewOrdersCount = orders.filter(o => o.status === 'new').length;

  return (
    <header 
      className="glass-panel" 
      style={{ 
        borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', 
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30,
        background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)'
      }}
    >
      {/* Store Title & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} color="#FFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>KitchenPulse</h1>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)', fontWeight: 600, border: '1px solid rgba(59, 130, 246, 0.25)' }}>Pro</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Downtown Hub #01</p>
          </div>
        </div>

        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)' }}>{timeStr}</span>
        </div>
      </div>

      {/* Platform Live Switches & Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500, textTransform: 'uppercase', marginRight: '4px' }}>Channels:</span>
          
          {/* Zomato Toggle */}
          <button
            onClick={() => toggleAggregatorStatus('zomato')}
            title="Click to toggle Zomato outlet status"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
              background: aggregators.zomato.online ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              border: `1px solid ${aggregators.zomato.online ? 'rgba(220, 38, 38, 0.3)' : 'var(--border-color)'}`,
              color: aggregators.zomato.online ? '#dc2626' : 'var(--text-dim)',
              fontSize: '0.75rem', fontWeight: 500
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: aggregators.zomato.online ? '#059669' : '#dc2626' }} />
            Zomato
          </button>

          {/* Swiggy Toggle */}
          <button
            onClick={() => toggleAggregatorStatus('swiggy')}
            title="Click to toggle Swiggy outlet status"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
              background: aggregators.swiggy.online ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              border: `1px solid ${aggregators.swiggy.online ? 'rgba(249, 115, 22, 0.3)' : 'var(--border-color)'}`,
              color: aggregators.swiggy.online ? '#f97316' : 'var(--text-dim)',
              fontSize: '0.75rem', fontWeight: 500
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: aggregators.swiggy.online ? '#059669' : '#dc2626' }} />
            Swiggy
          </button>

          {/* Direct Toggle */}
          <button
            onClick={() => toggleAggregatorStatus('direct')}
            title="Click to toggle Direct Outlet status"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
              background: aggregators.direct.online ? 'rgba(5, 150, 105, 0.1)' : 'transparent',
              border: `1px solid ${aggregators.direct.online ? 'rgba(5, 150, 105, 0.3)' : 'var(--border-color)'}`,
              color: aggregators.direct.online ? '#059669' : 'var(--text-dim)',
              fontSize: '0.75rem', fontWeight: 500
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: aggregators.direct.online ? '#059669' : '#dc2626' }} />
            Direct
          </button>
        </div>

        {/* Mute/Unmute Audio */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Audio Enabled' : 'Audio Muted'}
          style={{
            padding: '8px', borderRadius: '6px', background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: soundEnabled ? 'var(--text-main)' : 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center'
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Quick Simulator Trigger */}
        <button
          onClick={onOpenSimModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '6px', background: 'var(--bg-card)',
            border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 500,
            fontSize: '0.8rem', cursor: 'pointer'
          }}
        >
          <Radio size={14} />
          Simulator
        </button>

        {/* Create Manual Order Button */}
        <button
          onClick={onOpenNewOrderModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '6px', background: 'var(--accent-primary)',
            border: 'none', color: '#FFF', fontWeight: 600,
            fontSize: '0.8rem', cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          New Order
        </button>

        {/* Reset Demo */}
        <button
          onClick={resetDemoData}
          title="Reset to demo data"
          style={{
            padding: '8px', borderRadius: '6px', background: 'var(--bg-card)',
            border: '1px solid var(--border-color)', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center'
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
