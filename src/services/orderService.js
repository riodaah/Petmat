// Servicio simple de gestión de órdenes
// En producción, esto debería conectarse a una base de datos real

class OrderService {
  constructor() {
    // Simular base de datos en localStorage
    this.orders = this.loadOrders();
    this.nextOrderId = this.getNextOrderId();
  }

  // Cargar órdenes desde localStorage
  loadOrders() {
    try {
      const orders = localStorage.getItem('petmat_orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      return [];
    }
  }

  // Guardar órdenes en localStorage
  saveOrders() {
    try {
      localStorage.setItem('petmat_orders', JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error guardando órdenes:', error);
    }
  }

  // Obtener siguiente ID de orden
  getNextOrderId() {
    if (this.orders.length === 0) return 1;
    const maxId = Math.max(...this.orders.map(order => order.id));
    return maxId + 1;
  }

  // Crear nueva orden
  async createOrder(orderData) {
    const order = {
      id: this.nextOrderId++,
      ...orderData,
      created_at: new Date().toISOString(),
      status: 'pending',
      payment_status: 'pending',
    };

    this.orders.push(order);
    this.saveOrders();

    console.log('Orden creada:', order);
    return order;
  }

  // Obtener todas las órdenes
  getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Obtener orden por ID
  getOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  // Actualizar estado de orden
  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      this.saveOrders();
      return order;
    }
    return null;
  }

  // Actualizar estado de pago
  updatePaymentStatus(id, paymentStatus) {
    const order = this.getOrderById(id);
    if (order) {
      order.payment_status = paymentStatus;
      order.updated_at = new Date().toISOString();
      this.saveOrders();
      return order;
    }
    return null;
  }

  // Obtener estadísticas
  getStats() {
    const total = this.orders.length;
    const pending = this.orders.filter(o => o.status === 'pending').length;
    const completed = this.orders.filter(o => o.status === 'completed').length;
    const totalRevenue = this.orders
      .filter(o => o.payment_status === 'approved')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      total,
      pending,
      completed,
      totalRevenue,
    };
  }
}

export const orderService = new OrderService();



