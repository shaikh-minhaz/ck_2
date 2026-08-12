import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  PackageCheck, AlertTriangle, CheckCircle, RefreshCw, Plus, Search, Truck, DollarSign, Layers, X, Filter 
} from 'lucide-react';

export default function InventoryView() {
  const { inventory, updateStockQuantity, addInventoryItem } = useKitchen();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out', 'healthy'
  const [editingId, setEditingId] = useState(null);
  const [tempQty, setTempQty] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Ingredient form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Grains',
    stock: '',
    unit: 'kg',
    reorderLevel: 5,
    costPerUnit: '',
    supplier: ''
  });

  const lowStockCount = inventory.filter((i) => i.stock <= i.reorderLevel && i.stock > 0).length;
  const outOfStockCount = inventory.filter((i) => i.stock === 0).length;
  const healthyStockCount = inventory.filter((i) => i.stock > i.reorderLevel).length;

  const totalValuation = inventory.reduce((sum, item) => sum + (item.stock * item.costPerUnit), 0);

  // Filter inventory by both Search Query AND Clicked Metric Card Filter
  const filteredInventory = inventory.filter((item) => {
    // Search match
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query) ||
      item.unit.toLowerCase().includes(query) ||
      item.costPerUnit.toString().includes(query);

    // Stock status card match
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = item.stock <= item.reorderLevel && item.stock > 0;
    } else if (stockFilter === 'out') {
      matchesStock = item.stock === 0;
    } else if (stockFilter === 'healthy') {
      matchesStock = item.stock > item.reorderLevel;
    }

    return matchesSearch && matchesStock;
  });

  const handleSaveStock = (id) => {
    updateStockQuantity(id, tempQty);
    setEditingId(null);
  };

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.stock) return;

    addInventoryItem({
      name: newItem.name,
      category: newItem.category,
      stock: Number(newItem.stock),
      unit: newItem.unit,
      reorderLevel: Number(newItem.reorderLevel) || 5,
      costPerUnit: Number(newItem.costPerUnit) || 0,
      supplier: newItem.supplier || 'Local Supplier'
    });

    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'Grains',
      stock: '',
      unit: 'kg',
      reorderLevel: 5,
      costPerUnit: '',
      supplier: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Inventory & Stock Control</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap any metric card below to filter items, or use search to find materials</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Prominent Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search raw material, category, vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                background: 'rgba(24, 31, 46, 0.9)',
                border: searchQuery ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                color: '#FFF',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '9px 16px', borderRadius: '8px', background: 'var(--accent-direct)',
              border: 'none', color: '#FFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Plus size={16} /> Add Raw Material
          </button>
        </div>
      </div>

      {/* CLICKABLE METRIC CARDS GRID (Tap card to filter table) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        {/* Card 1: All Items */}
        <button
          onClick={() => setStockFilter('all')}
          style={{
            background: stockFilter === 'all' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
            border: stockFilter === 'all' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8' }}>
            <Layers size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Total Ingredients</span>
              {stockFilter === 'all' && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>ACTIVE</span>}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>{inventory.length} items</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Click to view all</span>
          </div>
        </button>

        {/* Card 2: Low Stock Warnings */}
        <button
          onClick={() => setStockFilter('low')}
          style={{
            background: stockFilter === 'low' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
            border: stockFilter === 'low' ? '2px solid #f59e0b' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Low Stock Warnings</span>
              {stockFilter === 'low' && <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>FILTERED</span>}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>{lowStockCount} items</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Click to filter</span>
          </div>
        </button>

        {/* Card 3: Out of Stock */}
        <button
          onClick={() => setStockFilter('out')}
          style={{
            background: stockFilter === 'out' ? 'rgba(220, 38, 38, 0.15)' : 'var(--bg-card)',
            border: stockFilter === 'out' ? '2px solid #dc2626' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Out of Stock</span>
              {stockFilter === 'out' && <span style={{ fontSize: '0.65rem', background: '#dc2626', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>FILTERED</span>}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>{outOfStockCount} items</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Click to filter</span>
          </div>
        </button>

        {/* Card 4: Healthy Stocks / Total Stock Valuation */}
        <button
          onClick={() => setStockFilter('healthy')}
          style={{
            background: stockFilter === 'healthy' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-card)',
            border: stockFilter === 'healthy' ? '2px solid #059669' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Healthy Stock ({healthyStockCount})</span>
              {stockFilter === 'healthy' && <span style={{ fontSize: '0.65rem', background: '#059669', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>FILTERED</span>}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>₹{totalValuation.toLocaleString('en-IN')}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Click to filter</span>
          </div>
        </button>

      </div>

      {/* Inventory Table Container */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Table Sub-Header + Filter Status Indicator Bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFF' }}>Raw Materials Ledger</h3>
            <span style={{ fontSize: '0.76rem', color: '#818CF8', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              {filteredInventory.length} of {inventory.length} items showing
            </span>
          </div>

          {/* Active Filter Badge & Clear Button */}
          {(stockFilter !== 'all' || searchQuery !== '') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
                Active Filter: {stockFilter === 'low' ? '⚠️ Low Stock Warnings' : stockFilter === 'out' ? '❌ Out of Stock' : stockFilter === 'healthy' ? '🟢 Healthy Stocks' : ''} {searchQuery ? `(Search: "${searchQuery}")` : ''}
              </span>
              <button
                onClick={() => {
                  setStockFilter('all');
                  setSearchQuery('');
                }}
                style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Inventory Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Ingredient Name</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Current Stock</th>
                <th style={{ padding: '14px 20px' }}>Reorder Level</th>
                <th style={{ padding: '14px 20px' }}>Cost / Unit</th>
                <th style={{ padding: '14px 20px' }}>Supplier</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No materials found matching current filter/search.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.stock <= item.reorderLevel && item.stock > 0;
                  const isOut = item.stock === 0;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>
                        {item.name}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.74rem' }}>
                          {item.category}
                        </span>
                      </td>

                      {/* Current Stock Input / Display */}
                      <td style={{ padding: '14px 20px' }}>
                        {editingId === item.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={tempQty}
                              onChange={(e) => setTempQty(e.target.value)}
                              style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', background: '#181F2E', border: '1px solid var(--accent-primary)', color: '#FFF', outline: 'none' }}
                            />
                            <button
                              onClick={() => handleSaveStock(item.id)}
                              style={{ padding: '4px 8px', borderRadius: '4px', background: '#10B981', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 800, color: isOut ? '#EF4444' : (isLow ? '#F59E0B' : '#FFF'), fontSize: '0.95rem' }}>
                            {item.stock} {item.unit}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                        {item.reorderLevel} {item.unit}
                      </td>

                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>
                        ₹{item.costPerUnit}/{item.unit}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Truck size={13} color="var(--text-dim)" />
                          {item.supplier}
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px', minWidth: '150px' }}>
                        {isOut ? (
                          <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.3)', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block' }}>
                            OUT OF STOCK ❌
                          </span>
                        ) : isLow ? (
                          <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block' }}>
                            LOW STOCK ⚠️
                          </span>
                        ) : (
                          <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block' }}>
                            HEALTHY 🟢
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setTempQty(item.stock.toString());
                          }}
                          style={{
                            padding: '6px 12px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818CF8', fontWeight: 700,
                            fontSize: '0.75rem', cursor: 'pointer'
                          }}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Material Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form
            onSubmit={handleCreateMaterial}
            className="glass-panel"
            style={{ width: '460px', padding: '24px', position: 'relative', background: '#121722' }}
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
              Add Raw Material to Inventory
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Material / Ingredient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amul Butter / Fresh Mutton"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#181F2E', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  >
                    <option value="Grains">Grains & Flour</option>
                    <option value="Meat">Meat & Poultry</option>
                    <option value="Dairy">Dairy & Cheese</option>
                    <option value="Oils">Oils & Ghee</option>
                    <option value="Spices">Spices & Sauces</option>
                    <option value="Bakery">Bakery & Buns</option>
                    <option value="Packaging">Packaging Boxes</option>
                    <option value="Beverages">Beverages & Pulp</option>
                    <option value="General">General Raw Goods</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#181F2E', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="L">L (Litre)</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="g">g (Gram)</option>
                    <option value="ml">ml (Millilitre)</option>
                    <option value="pack">pack (Packets)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Stock Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 25"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low Stock Alert Level</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5"
                    value={newItem.reorderLevel}
                    onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 180"
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem({ ...newItem, costPerUnit: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supplier / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Wholesale"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ marginTop: '10px', padding: '12px', background: 'var(--accent-direct)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Save Raw Material Entry
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
