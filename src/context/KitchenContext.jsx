import React, { createContext, useContext, useState, useEffect } from 'react';
import { playOrderAlertSound, playSuccessSound, playWarningSound } from '../utils/audioAlert';

const KitchenContext = createContext();

const INITIAL_MENU = [
  {
    id: 'm1',
    name: 'Hyderabadi Dum Chicken Biryani',
    category: 'Biryani & Rice',
    price: 349,
    prepTime: 18,
    isAvailable: true,
    platforms: { zomato: true, swiggy: true, direct: true },
    margin: '68%',
    bestseller: true,
    recipe: [
      { ingredientId: 'i1', qtyNeeded: 0.25 }, // Basmati Rice (kg)
      { ingredientId: 'i2', qtyNeeded: 0.30 }, // Raw Chicken (kg)
      { ingredientId: 'i5', qtyNeeded: 0.05 }, // Spices (kg)
      { ingredientId: 'i7', qtyNeeded: 1.00 }, // Packaging Container (pcs)
    ]
  },
  {
    id: 'm2',
    name: 'Paneer Butter Masala Bowl w/ Rice',
    category: 'Main Course Bowls',
    price: 289,
    prepTime: 15,
    isAvailable: true,
    platforms: { zomato: true, swiggy: true, direct: true },
    margin: '62%',
    bestseller: true,
    recipe: [
      { ingredientId: 'i1', qtyNeeded: 0.20 },
      { ingredientId: 'i3', qtyNeeded: 0.15 }, // Paneer (kg)
      { ingredientId: 'i4', qtyNeeded: 0.05 }, // Cooking Oil/Butter (L)
      { ingredientId: 'i7', qtyNeeded: 1.00 }
    ]
  },
  {
    id: 'm3',
    name: 'Smokey Truffle Cheese Burger',
    category: 'Burgers & Wraps',
    price: 249,
    prepTime: 12,
    isAvailable: true,
    platforms: { zomato: true, swiggy: true, direct: true },
    margin: '71%',
    bestseller: false,
    recipe: [
      { ingredientId: 'i6', qtyNeeded: 2.00 }, // Buns
      { ingredientId: 'i3', qtyNeeded: 0.08 },
      { ingredientId: 'i7', qtyNeeded: 1.00 }
    ]
  },
  {
    id: 'm4',
    name: 'Crispy Peri Peri French Fries',
    category: 'Sides & Snacks',
    price: 139,
    prepTime: 8,
    isAvailable: true,
    platforms: { zomato: true, swiggy: true, direct: true },
    margin: '82%',
    bestseller: false,
    recipe: [
      { ingredientId: 'i4', qtyNeeded: 0.02 },
      { ingredientId: 'i7', qtyNeeded: 1.00 }
    ]
  },
  {
    id: 'm5',
    name: 'Fresh Mango Lassi (350ml)',
    category: 'Beverages',
    price: 119,
    prepTime: 5,
    isAvailable: true,
    platforms: { zomato: true, swiggy: true, direct: true },
    margin: '75%',
    bestseller: true,
    recipe: [
      { ingredientId: 'i8', qtyNeeded: 0.15 }, // Mango Puree (L)
      { ingredientId: 'i7', qtyNeeded: 1.00 }
    ]
  },
  {
    id: 'm6',
    name: 'Hot Chocolate Fudge Sundae',
    category: 'Desserts',
    price: 179,
    prepTime: 6,
    isAvailable: false,
    platforms: { zomato: false, swiggy: false, direct: true },
    margin: '65%',
    bestseller: false,
    recipe: [
      { ingredientId: 'i7', qtyNeeded: 1.00 }
    ]
  }
];

const INITIAL_INVENTORY = [
  { id: 'i1', name: 'Premium Basmati Rice', category: 'Grains', stock: 45.0, unit: 'kg', reorderLevel: 15.0, costPerUnit: 90, supplier: 'Agro Traders' },
  { id: 'i2', name: 'Fresh Boneless Chicken', category: 'Meat', stock: 18.5, unit: 'kg', reorderLevel: 8.0, costPerUnit: 220, supplier: 'Delight Meats' },
  { id: 'i3', name: 'Fresh Cottage Cheese (Paneer)', category: 'Dairy', stock: 12.0, unit: 'kg', reorderLevel: 5.0, costPerUnit: 340, supplier: 'Amul Distributor' },
  { id: 'i4', name: 'Pure Refined Sunflower Oil', category: 'Oils', stock: 24.0, unit: 'L', reorderLevel: 10.0, costPerUnit: 140, supplier: 'Fortune WholeSales' },
  { id: 'i5', name: 'Special Indian Spice Blend', category: 'Spices', stock: 4.5, unit: 'kg', reorderLevel: 2.0, costPerUnit: 450, supplier: 'MDH Spices Hub' },
  { id: 'i6', name: 'Brioche Burger Buns', category: 'Bakery', stock: 48, unit: 'pcs', reorderLevel: 20, costPerUnit: 15, supplier: 'City Bakery' },
  { id: 'i7', name: 'Eco Leak-proof Meal Box', category: 'Packaging', stock: 140, unit: 'pcs', reorderLevel: 50, costPerUnit: 12, supplier: 'GreenPack India' },
  { id: 'i8', name: 'Alphonso Mango Pulp', category: 'Dairy/Beverage', stock: 3.2, unit: 'L', reorderLevel: 5.0, costPerUnit: 180, supplier: 'FreshFruits Co' }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-9821',
    platform: 'zomato',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Towers, Sector 14, Gurugram',
    items: [
      { id: 'm1', name: 'Hyderabadi Dum Chicken Biryani', price: 349, quantity: 2 },
      { id: 'm5', name: 'Fresh Mango Lassi (350ml)', price: 119, quantity: 2 }
    ],
    subtotal: 936,
    commission: 205.9,
    netRevenue: 730.1,
    status: 'new', // new, preparing, ready, out_for_delivery, completed, cancelled
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    prepTimeMins: 18,
    riderName: 'Zomato Rider (Vikram)',
    notes: 'Please make biryani extra spicy & send tissue paper.'
  },
  {
    id: 'ORD-9820',
    platform: 'swiggy',
    customerName: 'Priya Verma',
    phone: '+91 98112 34567',
    address: 'Villa 12, Palm Meadows, Cyber City',
    items: [
      { id: 'm2', name: 'Paneer Butter Masala Bowl w/ Rice', price: 289, quantity: 1 },
      { id: 'm4', name: 'Crispy Peri Peri French Fries', price: 139, quantity: 1 }
    ],
    subtotal: 428,
    commission: 102.7,
    netRevenue: 325.3,
    status: 'preparing',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    prepTimeMins: 15,
    riderName: 'Swiggy Express (Amit K.)',
    notes: 'No cutlery needed.'
  },
  {
    id: 'ORD-9819',
    platform: 'direct',
    customerName: 'Karan Malhotra',
    phone: '+91 99554 11223',
    address: 'Office 301, Spaze Tech Park',
    items: [
      { id: 'm3', name: 'Smokey Truffle Cheese Burger', price: 249, quantity: 2 },
      { id: 'm4', name: 'Crispy Peri Peri French Fries', price: 139, quantity: 2 }
    ],
    subtotal: 776,
    commission: 0,
    netRevenue: 776,
    status: 'ready',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    prepTimeMins: 12,
    riderName: 'Kitchen Direct Delivery Boy (Ramesh)',
    notes: 'Call before arriving.'
  },
  {
    id: 'ORD-9818',
    platform: 'zomato',
    customerName: 'Ananya Gupta',
    phone: '+91 97110 88990',
    address: 'Block C-45, Sushant Lok Phase 1',
    items: [
      { id: 'm1', name: 'Hyderabadi Dum Chicken Biryani', price: 349, quantity: 1 }
    ],
    subtotal: 349,
    commission: 76.78,
    netRevenue: 272.22,
    status: 'completed',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    prepTimeMins: 18,
    riderName: 'Zomato Valet (Sunil)',
    notes: ''
  }
];

const INITIAL_EXPENSES = [
  { id: 'e1', title: 'Monthly Cloud Kitchen Space Rent', category: 'Rent', amount: 45000, date: '2026-07-01', notes: 'Downtown Hub Kitchen #01' },
  { id: 'e2', title: 'Commercial LPG Cylinder (4x)', category: 'Utilities', amount: 9200, date: '2026-07-15', notes: 'HP Commercial Gas' },
  { id: 'e3', title: 'Staff Salaries (Head Chef + 2 Prep)', category: 'Salaries', amount: 65000, date: '2026-07-01', notes: 'Monthly payroll' },
  { id: 'e4', title: 'Eco Meal Packaging Boxes Order', category: 'Packaging', amount: 12500, date: '2026-07-20', notes: 'GreenPack India Invoice #884' },
  { id: 'e5', title: 'Kitchen Electricity & Power Backup Bill', category: 'Utilities', amount: 14200, date: '2026-07-10', notes: 'Commercial Meter' }
];

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Sharma', phone: '+91 98765 43210', totalOrders: 14, totalSpend: 5420, favItem: 'Hyderabadi Dum Chicken Biryani', tag: 'VIP Customer', lastOrder: '2026-07-28' },
  { id: 'c2', name: 'Priya Verma', phone: '+91 98112 34567', totalOrders: 8, totalSpend: 2890, favItem: 'Paneer Butter Masala Bowl', tag: 'Regular', lastOrder: '2026-07-28' },
  { id: 'c3', name: 'Karan Malhotra', phone: '+91 99554 11223', totalOrders: 5, totalSpend: 2150, favItem: 'Smokey Truffle Cheese Burger', tag: 'Direct Customer', lastOrder: '2026-07-28' },
  { id: 'c4', name: 'Ananya Gupta', phone: '+91 97110 88990', totalOrders: 3, totalSpend: 1047, favItem: 'Hyderabadi Dum Chicken Biryani', tag: 'New', lastOrder: '2026-07-28' }
];

export function KitchenProvider({ children }) {
  // State initialization with localStorage backup
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('kp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('kp_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('kp_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('kp_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('kp_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Aggregator API Settings
  const [aggregators, setAggregators] = useState({
    zomato: { online: true, autoAccept: false, commissionRate: 0.22, name: 'Zomato', color: '#dc2626' },
    swiggy: { online: true, autoAccept: false, commissionRate: 0.24, name: 'Swiggy', color: '#f97316' },
    direct: { online: true, autoAccept: false, commissionRate: 0.00, name: 'Direct Outlet', color: '#059669' }
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu, inventory, analytics, financials, customers
  const [simulating, setSimulating] = useState(true); // Auto order simulator active
  const [toastNotification, setToastNotification] = useState(null);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem('kp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kp_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('kp_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('kp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('kp_customers', JSON.stringify(customers));
  }, [customers]);

  // Show Toast Notification
  const showToast = (message, type = 'info') => {
    setToastNotification({ message, type, id: Date.now() });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Sound Toggle Trigger
  const triggerOrderAudio = () => {
    if (soundEnabled) {
      playOrderAlertSound();
    }
  };

  // Toggle Aggregator Channel Online/Offline
  const toggleAggregatorStatus = (platformKey) => {
    setAggregators((prev) => {
      const updated = { ...prev, [platformKey]: { ...prev[platformKey], online: !prev[platformKey].online } };
      showToast(`${prev[platformKey].name} outlet status updated to ${updated[platformKey].online ? 'ONLINE 🟢' : 'OFFLINE 🔴'}`, updated[platformKey].online ? 'success' : 'warning');
      return updated;
    });
  };

  // Deduct stock automatically based on recipe mapping when an order is accepted
  const deductStockForOrder = (order) => {
    setInventory((prevInv) => {
      const nextInv = [...prevInv];
      let lowStockTriggered = false;

      order.items.forEach((item) => {
        const menuItem = menu.find((m) => m.id === item.id || m.name === item.name);
        if (menuItem && menuItem.recipe) {
          menuItem.recipe.forEach((rec) => {
            const ingIdx = nextInv.findIndex((i) => i.id === rec.ingredientId);
            if (ingIdx !== -1) {
              const qtyToDeduct = rec.qtyNeeded * item.quantity;
              const newStock = Math.max(0, Number((nextInv[ingIdx].stock - qtyToDeduct).toFixed(2)));
              nextInv[ingIdx] = { ...nextInv[ingIdx], stock: newStock };

              if (newStock <= nextInv[ingIdx].reorderLevel) {
                lowStockTriggered = true;
              }
            }
          });
        }
      });

      if (lowStockTriggered && soundEnabled) {
        playWarningSound();
        showToast('⚠️ Low stock threshold warning triggered for ingredients!', 'warning');
      }

      return nextInv;
    });
  };

  // Add New Incoming Order
  const addOrder = (newOrderData) => {
    const platformKey = newOrderData.platform || 'zomato';

    // Verify platform is online
    if (aggregators[platformKey] && !aggregators[platformKey].online) {
      showToast(`Cannot place order: ${aggregators[platformKey].name} is currently Offline!`, 'warning');
      return null;
    }

    const commissionRate = aggregators[platformKey]?.commissionRate || 0;
    const subtotal = newOrderData.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const commission = Number((subtotal * commissionRate).toFixed(2));
    const netRevenue = Number((subtotal - commission).toFixed(2));

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullOrder = {
      id: orderId,
      platform: platformKey,
      customerName: newOrderData.customerName || 'Anonymous Customer',
      phone: newOrderData.phone || '+91 98000 11223',
      address: newOrderData.address || 'DLF Phase 3, Cyber Hub, Gurugram',
      items: newOrderData.items,
      subtotal,
      commission,
      netRevenue,
      status: aggregators[platformKey]?.autoAccept ? 'preparing' : 'new',
      createdAt: new Date().toISOString(),
      prepTimeMins: newOrderData.prepTimeMins || 15,
      riderName: newOrderData.riderName || `${aggregators[platformKey].name} Valet`,
      notes: newOrderData.notes || ''
    };

    setOrders((prev) => [fullOrder, ...prev]);

    // Audio chime & notification
    triggerOrderAudio();
    showToast(`🔔 New ${aggregators[platformKey].name} Order Received! #${fullOrder.id} (₹${subtotal})`, 'info');

    // Auto deduct stock if auto-accepted
    if (fullOrder.status === 'preparing') {
      deductStockForOrder(fullOrder);
    }

    // Register or update customer profile
    updateCustomerProfile(fullOrder);

    return fullOrder;
  };

  // Update Customer CRM
  const updateCustomerProfile = (order) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.phone === order.phone || c.name === order.customerName);
      if (idx !== -1) {
        const updated = [...prev];
        const existing = updated[idx];
        updated[idx] = {
          ...existing,
          totalOrders: existing.totalOrders + 1,
          totalSpend: existing.totalSpend + order.subtotal,
          lastOrder: new Date().toISOString().split('T')[0]
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `c${Date.now()}`,
            name: order.customerName,
            phone: order.phone,
            totalOrders: 1,
            totalSpend: order.subtotal,
            favItem: order.items[0]?.name || 'Biryani',
            tag: 'New Customer',
            lastOrder: new Date().toISOString().split('T')[0]
          }
        ];
      }
    });
  };

  // Progress Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => {
      return prev.map((ord) => {
        if (ord.id === orderId) {
          // If status moving from 'new' to 'preparing', deduct stock now
          if (ord.status === 'new' && newStatus === 'preparing') {
            deductStockForOrder(ord);
          }
          if (newStatus === 'completed' && soundEnabled) {
            playSuccessSound();
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      });
    });
    showToast(`Order #${orderId} moved to ${newStatus.toUpperCase()}`, 'success');
  };

  // Menu Management Handlers
  const toggleMenuItemPlatform = (menuId, platformKey) => {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.id === menuId) {
          const updatedPlatforms = { ...item.platforms, [platformKey]: !item.platforms[platformKey] };
          return { ...item, platforms: updatedPlatforms };
        }
        return item;
      })
    );
  };

  const toggleMenuItemAvailability = (menuId) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === menuId ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const addMenuItem = (newItem) => {
    setMenu((prev) => [...prev, { ...newItem, id: `m${Date.now()}` }]);
    showToast(`Added ${newItem.name} to kitchen menu!`, 'success');
  };

  // Inventory Management Handlers
  const updateStockQuantity = (ingredientId, newStockQty) => {
    setInventory((prev) =>
      prev.map((ing) => (ing.id === ingredientId ? { ...ing, stock: Math.max(0, Number(newStockQty)) } : ing))
    );
    showToast('Inventory stock level updated', 'success');
  };

  const addInventoryItem = (newItem) => {
    const ingredientId = `i${Date.now()}`;
    setInventory((prev) => [
      ...prev,
      {
        id: ingredientId,
        name: newItem.name,
        category: newItem.category || 'General',
        stock: Number(newItem.stock) || 0,
        unit: newItem.unit || 'kg',
        reorderLevel: Number(newItem.reorderLevel) || 5,
        costPerUnit: Number(newItem.costPerUnit) || 0,
        supplier: newItem.supplier || 'Local Vendor'
      }
    ]);
    showToast(`Added ${newItem.name} to raw material inventory!`, 'success');
  };

  const addExpense = (newExp) => {
    setExpenses((prev) => [{ ...newExp, id: `e${Date.now()}` }, ...prev]);
    showToast('New expense logged successfully!', 'success');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    setOrders(INITIAL_ORDERS);
    setMenu(INITIAL_MENU);
    setInventory(INITIAL_INVENTORY);
    setExpenses(INITIAL_EXPENSES);
    setCustomers(INITIAL_CUSTOMERS);
    showToast('Kitchen OS reset to default initial state!', 'info');
  };

  return (
    <KitchenContext.Provider
      value={{
        orders,
        menu,
        inventory,
        expenses,
        customers,
        aggregators,
        soundEnabled,
        setSoundEnabled,
        activeTab,
        setActiveTab,
        simulating,
        setSimulating,
        toastNotification,
        showToast,
        addOrder,
        updateOrderStatus,
        toggleAggregatorStatus,
        toggleMenuItemPlatform,
        toggleMenuItemAvailability,
        addMenuItem,
        updateStockQuantity,
        addInventoryItem,
        addExpense,
        resetDemoData,
        triggerOrderAudio
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  return useContext(KitchenContext);
}
