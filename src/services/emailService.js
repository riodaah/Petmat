const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://sunny-comfort-production.up.railway.app';

export const emailService = {
  // Enviar email de contacto
  async sendContactEmail(formData) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          message: formData.message
        })
      });

      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: new Error(result?.error || 'No se pudo enviar el mensaje') };
      }

      return { success: true, result };
    } catch (error) {
      return { success: false, error };
    }
  }
};

