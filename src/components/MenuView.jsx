import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { 
  UtensilsCrossed, Plus, Search, Check, X, ShieldAlert, Sparkles, Clock, Percent, Eye, EyeOff 
} from 'lucide-react';

export default function MenuView() {
  const { menu, toggleMenuItemPlatform, toggleMenuItemAvailability, addMenuItem, inventory } = useKitchen();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Dish Form state
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Biryani & Rice',
    price: 299,
    prepTime: 15,
    margin: '65%',
    bestseller: false,
    platforms: { zomato: true, swiggy: true, direct: true }
  });

  const categories = ['All', 'Biryani & Rice', 'Main Course Bowls', 'Burgers & Wraps', 'Sides & Snacks', 'Beverages', 'Desserts'];

  const filteredMenu = menu.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newDish.name) return;
    addMenuItem({
      ...newDish,
      isAvailable: true,
      recipe: [
        { ingredientId: 'i7', qtyNeeded: 1.0 }
      ]
    });
    setShowAddModal(false);
    setNewDish({
      name: '',
      category: 'Biryani & Rice',
      price: 299,
      prepTime: 15,
      margin: '65%',
      bestseller: false,
      platforms: { zomato: true, swiggy: true, direct: true }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Menu & Recipe Control Hub</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Manage dish prices, Zomato/Swiggy visibility, and stock availability</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search dish name..."
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

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '8px 16px', borderRadius: '6px', background: 'var(--accent-primary)',
              border: 'none', color: '#FFF', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Plus size={16} /> Add New Dish
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--border-color)',
              background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: selectedCategory === cat ? '#FFF' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredMenu.map((dish) => (
          <div
            key={dish.id}
            className="glass-card"
            style={{
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
              opacity: dish.isAvailable ? 1 : 0.6, position: 'relative'
            }}
          >
            {/* Header: Name + Bestseller Badge + Overall Stock Switch */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFF' }}>{dish.name}</h3>
                  {dish.bestseller && (
                    <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      BESTSELLER 🔥
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{dish.category}</span>
              </div>

              {/* In Stock / Out of Stock toggle */}
              <button
                onClick={() => toggleMenuItemAvailability(dish.id)}
                title="Toggle In-Stock / Out of Stock Status"
                style={{
                  padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  background: dish.isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: dish.isAvailable ? '#34D399' : '#F87171',
                  fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                {dish.isAvailable ? <Eye size={12} /> : <EyeOff size={12} />}
                {dish.isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
              </button>
            </div>

            {/* Price, Prep Time, Margin */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Selling Price: </span>
                <strong style={{ color: '#FFF', fontSize: '0.95rem' }}>₹{dish.price}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={12} color="#818CF8" /> {dish.prepTime} mins
                </span>
                <span style={{ color: '#10B981', fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Percent size={11} /> {dish.margin} margin
                </span>
              </div>
            </div>

            {/* Platform Visibility Toggles */}
            <div style={{ borderTop: '1px border var(--border-color)', paddingTop: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                Channel Availability (Zomato / Swiggy Visibility):
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Zomato */}
                <button
                  onClick={() => toggleMenuItemPlatform(dish.id, 'zomato')}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', cursor: 'pointer',
                    background: dish.platforms.zomato ? 'rgba(226, 55, 68, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${dish.platforms.zomato ? '#E23744' : 'rgba(255,255,255,0.1)'}`,
                    color: dish.platforms.zomato ? '#FF6B6B' : 'var(--text-dim)',
                    fontSize: '0.74rem', fontWeight: 700
                  }}
                >
                  Zomato {dish.platforms.zomato ? 'ON 🟢' : 'OFF 🔴'}
                </button>

                {/* Swiggy */}
                <button
                  onClick={() => toggleMenuItemPlatform(dish.id, 'swiggy')}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', cursor: 'pointer',
                    background: dish.platforms.swiggy ? 'rgba(252, 128, 25, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${dish.platforms.swiggy ? '#FC8019' : 'rgba(255,255,255,0.1)'}`,
                    color: dish.platforms.swiggy ? '#FDBA74' : 'var(--text-dim)',
                    fontSize: '0.74rem', fontWeight: 700
                  }}
                >
                  Swiggy {dish.platforms.swiggy ? 'ON 🟢' : 'OFF 🔴'}
                </button>

                {/* Direct */}
                <button
                  onClick={() => toggleMenuItemPlatform(dish.id, 'direct')}
                  style={{
                    flex: 1, padding: '6px', borderRadius: '6px', cursor: 'pointer',
                    background: dish.platforms.direct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${dish.platforms.direct ? '#10B981' : 'rgba(255,255,255,0.1)'}`,
                    color: dish.platforms.direct ? '#6EE7B7' : 'var(--text-dim)',
                    fontSize: '0.74rem', fontWeight: 700
                  }}
                >
                  Direct {dish.platforms.direct ? 'ON 🟢' : 'OFF 🔴'}
                </button>
              </div>
            </div>

            {/* Recipe Ingredient Link Breakdown */}
            {dish.recipe && dish.recipe.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#818CF8' }}>Recipe Auto-Deduction: </strong>
                {dish.recipe.map((r, i) => {
                  const ing = inventory.find((it) => it.id === r.ingredientId);
                  return ing ? `${r.qtyNeeded}${ing.unit} ${ing.name}${i < dish.recipe.length - 1 ? ', ' : ''}` : '';
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form
            onSubmit={handleCreateDish}
            className="glass-panel"
            style={{ width: '450px', padding: '24px', position: 'relative', background: '#121722' }}
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
              Add New Dish to Kitchen
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mutton Biryani"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#181F2E', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prep Time (mins)</label>
                  <input
                    type="number"
                    value={newDish.prepTime}
                    onChange={(e) => setNewDish({ ...newDish, prepTime: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Margin %</label>
                  <input
                    type="text"
                    value={newDish.margin}
                    onChange={(e) => setNewDish({ ...newDish, margin: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(24,31,46,0.9)', border: '1px solid var(--border-color)', color: '#FFF', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ marginTop: '10px', padding: '12px', background: 'var(--accent-primary)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Save & Publish Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
