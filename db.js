/*
  DATABASE FILE
  -------------
  Website er shob data likha/pora ei file diye hoy. Ekhon database nai,
  tai shamoyik bhabe browser er localStorage e data thake (shudhu ei browser e dekha jabe).

  Pore Firebase/Supabase/nijer server lagale shudhu ei file er 3 ta function
  (saveOrder, getRecentOrders, updateOrderStatus) bodlate hobe.
  index.html, style.css ba script.js e kichu bodlate hobe na.
*/

const DB = (() => {
  const KEY = "shop_orders";

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };

  return {
    // Notun order save kore. Promise ferot dey, jate pore real database e boshale ekoi vabe chole.
    async saveOrder(order) {
      const orders = read();
      const saved = {
        ...order,
        id: "ORD" + Date.now().toString().slice(-8),
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      orders.unshift(saved);
      localStorage.setItem(KEY, JSON.stringify(orders.slice(0, 200)));
      return saved;
    },

    // Shomprotik order er list (home page er "Recent Orders" er jonno).
    async getRecentOrders(limit = 8) {
      return read().slice(0, limit);
    },

    // Admin order er status bodlate chaile (Pending / Done).
    async updateOrderStatus(id, status) {
      const orders = read().map(o => (o.id === id ? { ...o, status } : o));
      localStorage.setItem(KEY, JSON.stringify(orders));
    }
  };
})();

/* ---- Pore Firebase boshale ei rokom hobe (example, ekhon chalu noy) ----
  const DB = {
    async saveOrder(order) {
      const ref = await addDoc(collection(firestore, "orders"), { ...order, status: "Pending", createdAt: serverTimestamp() });
      return { ...order, id: ref.id, status: "Pending" };
    },
    ...
  };
*/
