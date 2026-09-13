// Capa de datos compartida - Cleaner Computer Shop
// Usa localStorage para que TODAS las páginas del sitio (dashboard técnico,
// catálogo, estado de orden) lean y escriban la misma información.
// IMPORTANTE: localStorage vive en el navegador de cada computadora.
// Mientras trabajes en localhost esto es perfecto para desarrollar y probar
// el flujo completo. Cuando pases a producción con varios técnicos y
// clientes reales, esta capa se debe reemplazar por llamadas a un backend
// real (API + base de datos), pero la forma en que la usan las páginas
// (CCS.Orders.getAll(), CCS.Orders.add(), etc.) puede quedarse casi igual.

window.CCS = (function () {
  const ORDERS_KEY = 'ccs_orders_v2';
  const PRODUCTS_KEY = 'ccs_products_v1';
  const TECH_SESSION_KEY = 'ccs_session_tecnico_v1';

  // ---------- Datos semilla (solo se usan la primera vez) ----------

  const seedOrders = [
    {
      id: 'ORD-00042',
      equipo: 'Dell XPS 15 9500',
      numeroSerie: 'DXP159500-A1',
      problema: 'Reemplazo de pasta térmica y limpieza profunda de ventiladores. Cambio de thermal pads en VRM.',
      status: 'progreso',
      cliente: { nombre: 'Marco Aurelio Reyes' },
      costos: { diagnostico: 350, manoObra: 500, anticipo: 400, piezas: [] },
      fechaIngreso: '2024-10-22'
    },
    {
      id: 'ORD-00043',
      equipo: 'MacBook Pro M1 2020',
      numeroSerie: 'C02GH34QML7H',
      problema: 'Diagnóstico: No enciende. Cliente reporta derrame de líquido leve hace 2 días.',
      status: 'ingresado',
      cliente: { nombre: 'Ana Lucía Torres' },
      costos: { diagnostico: 350, manoObra: 0, anticipo: 0, piezas: [] },
      fechaIngreso: '2024-10-24'
    },
    {
      id: 'ORD-00041',
      equipo: 'Asus ROG Zephyrus G14',
      numeroSerie: 'ASZ-G14-7789',
      problema: 'Ampliación de RAM (16GB a 32GB) e instalación de SSD NVMe 2TB. SO clonado con éxito.',
      status: 'listo',
      cliente: { nombre: 'Roberto Medina' },
      costos: { diagnostico: 0, manoObra: 300, anticipo: 500, piezas: [{ nombre: 'SSD NVMe M.2 2TB PCIe 4.0', costo: 185, cantidad: 1 }] },
      fechaIngreso: '2024-10-18'
    }
  ];

  const seedProducts = [
    {
      id: 'PRD-001',
      categoria: 'Laptop Profesional',
      nombre: 'Workstation Pro X1 - Intel Core i9, 32GB RAM, 1TB NVMe',
      specs: [{ label: 'CPU', value: 'i9-13900H' }, { label: 'RAM', value: '32GB DDR5' }, { label: 'GPU', value: 'RTX 4070' }],
      precio: 2499.00,
      badge: 'NUEVO'
    },
    {
      id: 'PRD-002',
      categoria: 'Componente',
      nombre: 'Motherboard Z790 AORUS Elite AX DDR5',
      specs: [{ label: 'Socket', value: 'LGA 1700' }, { label: 'Formato', value: 'ATX' }, { label: 'Wi-Fi', value: 'Wi-Fi 6E' }],
      precio: 289.50
    },
    {
      id: 'PRD-003',
      categoria: 'Accesorio',
      nombre: 'Auriculares Inalámbricos Pro ANC-700',
      specs: [{ label: 'Tipo', value: 'Over-ear' }, { label: 'Batería', value: '30h' }, { label: 'Cancelación', value: 'Activa' }],
      precio: 299.00,
      precioOriginal: 349.00,
      badge: 'OFERTA'
    },
    {
      id: 'PRD-004',
      categoria: 'Almacenamiento',
      nombre: 'SSD NVMe M.2 2TB PCIe 4.0 Pro Performance',
      specs: [{ label: 'Capacidad', value: '2TB' }, { label: 'Lectura', value: '7300 MB/s' }, { label: 'Escritura', value: '6900 MB/s' }],
      precio: 185.00
    }
  ];

  // ---------- Helpers internos ----------

  function loadOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('CCS: no se pudo leer órdenes', e); }
    const seed = seedOrders.slice();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  function loadProducts() {
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('CCS: no se pudo leer productos', e); }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
    return seedProducts.slice();
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  function nextProductId(products) {
    const nums = products.map(p => parseInt(p.id.split('-')[1], 10)).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return 'PRD-' + String(max + 1).padStart(3, '0');
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  function nextOrderId(orders) {
    const nums = orders.map(o => parseInt(o.id.split('-')[1], 10)).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 40;
    return 'ORD-' + String(max + 1).padStart(5, '0');
  }

  function nextProductId(products) {
    const nums = products.map(p => parseInt(p.id.split('-')[1], 10)).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return 'PRD-' + String(max + 1).padStart(3, '0');
  }

  // ---------- API pública: Órdenes ----------

  const Orders = {
    getAll() {
      return loadOrders();
    },
    getById(id) {
      return loadOrders().find(o => o.id === id) || null;
    },
    findByFolioAndName(folio, nombre) {
      const order = loadOrders().find(o => o.id.toLowerCase() === String(folio).trim().toLowerCase());
      if (!order || !order.cliente || !order.cliente.nombre) return null;
      const match = order.cliente.nombre.trim().toLowerCase() === String(nombre).trim().toLowerCase();
      return match ? order : null;
    },
    add(data) {
      const orders = loadOrders();
      const order = {
        id: nextOrderId(orders),
        equipo: data.equipo,
        numeroSerie: data.numeroSerie || '',
        problema: data.problema,
        status: data.status || 'ingresado',
        cliente: { nombre: data.clienteNombre || 'Cliente sin registrar' },
        costos: { diagnostico: 0, manoObra: 0, anticipo: 0, piezas: [] },
        fechaIngreso: new Date().toISOString().slice(0, 10)
      };
      orders.push(order);
      saveOrders(orders);
      return order;
    },
    update(id, patch) {
      const orders = loadOrders();
      const order = orders.find(o => o.id === id);
      if (!order) return null;
      Object.assign(order, patch);
      saveOrders(orders);
      return order;
    },
    updateStatus(id, status) {
      return Orders.update(id, { status });
    },
    updateCostos(id, costosPatch) {
      const orders = loadOrders();
      const order = orders.find(o => o.id === id);
      if (!order) return null;
      order.costos = Object.assign({}, order.costos, costosPatch);
      saveOrders(orders);
      return order;
    },
    addProductToOrder(id, product, cantidad) {
      const orders = loadOrders();
      const order = orders.find(o => o.id === id);
      if (!order) return null;
      if (!order.costos) order.costos = { diagnostico: 0, manoObra: 0, anticipo: 0, piezas: [] };
      if (!order.costos.piezas) order.costos.piezas = [];
      order.costos.piezas.push({ nombre: product.nombre, costo: product.precio * cantidad, cantidad });
      saveOrders(orders);
      return order;
    },
    delete(id) {
      const orders = loadOrders().filter(o => o.id !== id);
      saveOrders(orders);
    },
    computeTotal(order) {
      const piezasTotal = (order.costos.piezas || []).reduce((s, p) => s + p.costo, 0);
      const subtotal = (order.costos.diagnostico || 0) + piezasTotal + (order.costos.manoObra || 0);
      const total = subtotal - (order.costos.anticipo || 0);
      return { piezasTotal, subtotal, total };
    }
  };

  // ---------- API pública: Catálogo de productos ----------

  const Products = {
    getAll() {
      return loadProducts();
    },
    getById(id) {
      return loadProducts().find(p => p.id === id) || null;
    },
    add(data) {
      const products = loadProducts();
      const product = {
        id: nextProductId(products),
        nombre: data.nombre,
        categoria: data.categoria,
        precio: data.precio,
        precioOriginal: data.precioOriginal || null,
        badge: data.badge || null,
        specs: data.specs || []
      };
      products.push(product);
      saveProducts(products);
      return product;
    },
    update(id, patch) {
      const products = loadProducts();
      const product = products.find(p => p.id === id);
      if (!product) return null;
      Object.assign(product, patch);
      saveProducts(products);
      return product;
    },
    delete(id) {
      const products = loadProducts().filter(p => p.id !== id);
      saveProducts(products);
    }
  };

  // ---------- API pública: Sesión del técnico (demo, sin backend) ----------
  // Usuario y contraseña fijos SOLO para desarrollo en localhost.
  // Antes de publicar el sitio hay que reemplazar esto por autenticación real.
  const DEMO_USER = 'tecnico';
  const DEMO_PASS = '1234';

  const Session = {
    loginTecnico(usuario, password) {
      if (usuario === DEMO_USER && password === DEMO_PASS) {
        sessionStorage.setItem(TECH_SESSION_KEY, JSON.stringify({ usuario, ts: Date.now() }));
        return true;
      }
      return false;
    },
    isTecnicoLoggedIn() {
      return !!sessionStorage.getItem(TECH_SESSION_KEY);
    },
    logoutTecnico() {
      sessionStorage.removeItem(TECH_SESSION_KEY);
    },
    requireTecnico() {
      if (!Session.isTecnicoLoggedIn()) {
        window.location.href = 'login-tecnico.html';
      }
    },
    currentTecnico() {
      try { return JSON.parse(sessionStorage.getItem(TECH_SESSION_KEY)).usuario; }
      catch (e) { return null; }
    }
  };

  // ---------- Utilidades ----------

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function formatMoney(n) {
    return '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
  }

  function toast(msg, elId) {
    const el = document.getElementById(elId || 'toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Construye una línea de tiempo genérica de 3 pasos a partir del status
  // usado en el dashboard (ingresado / progreso / pendiente / listo).
  function buildTimeline(status) {
    const steps = [
      { key: 'recepcion', titulo: 'Recepción y Diagnóstico Inicial' },
      { key: 'reparacion', titulo: 'Reparación en Curso' },
      { key: 'calidad', titulo: 'Pruebas de Calidad' }
    ];
    const estadoPorPaso = {
      ingresado: ['en-progreso', 'pendiente', 'pendiente'],
      progreso: ['completado', 'en-progreso', 'pendiente'],
      pendiente: ['completado', 'en-progreso', 'pendiente'],
      listo: ['completado', 'completado', 'completado']
    };
    const estados = estadoPorPaso[status] || estadoPorPaso.ingresado;
    return steps.map((s, i) => ({ titulo: s.titulo, estado: estados[i] }));
  }

  return { Orders, Products, Session, util: { escapeHtml, formatMoney, toast, buildTimeline } };
})();
