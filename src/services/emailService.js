import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, EMAIL_TEMPLATES } from '../config/emailjs.js';

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export const emailService = {
  // Enviar email de contacto
  async sendContactEmail(formData) {
    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: EMAILJS_CONFIG.USER_ID,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAIL_TEMPLATES.CONTACT,
        templateParams
      );

      console.log('Email de contacto enviado:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error enviando email de contacto:', error);
      return { success: false, error };
    }
  },

  // Enviar confirmación de compra al cliente
  async sendOrderConfirmation(orderData, customerEmail) {
    try {
      const templateParams = {
        to_email: customerEmail,
        customer_name: orderData.customer.name,
        order_id: orderData.id,
        total: orderData.total,
        items: orderData.items.map(item => 
          `${item.name} x${item.quantity} - $${item.price.toLocaleString()}`
        ).join('\n'),
        shipping_address: orderData.shipping.address,
        estimated_delivery: orderData.estimated_delivery,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAIL_TEMPLATES.ORDER_CONFIRMATION,
        templateParams
      );

      console.log('Email de confirmación enviado:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error enviando confirmación:', error);
      return { success: false, error };
    }
  },

  // Notificar nueva orden al administrador
  async sendNewOrderNotification(orderData) {
    try {
      const templateParams = {
        to_email: EMAILJS_CONFIG.USER_ID,
        order_id: orderData.id,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        total: orderData.total,
        items: orderData.items.map(item => 
          `${item.name} x${item.quantity} - $${item.price.toLocaleString()}`
        ).join('\n'),
        shipping_address: orderData.shipping.address,
        payment_status: orderData.payment_status,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAIL_TEMPLATES.NEW_ORDER,
        templateParams
      );

      console.log('Notificación de nueva orden enviada:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return { success: false, error };
    }
  }
};
