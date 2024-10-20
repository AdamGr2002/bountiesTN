import axios from 'axios';

const FLOUCI_API_URL = 'https://developers.flouci.com/api/v1';
const FLOUCI_API_KEY = process.env.FLOUCI_API_KEY;

export async function createPayment(amount: number, orderId: string) {
  try {
    const response = await axios.post(`${FLOUCI_API_URL}/payments`, {
      app_token: FLOUCI_API_KEY,
      app_secret: process.env.FLOUCI_APP_SECRET,
      amount: amount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      fail_link: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
      developer_tracking_id: orderId,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Flouci payment:', error);
    throw error;
  }
}

export async function verifyPayment(paymentId: string) {
  try {
    const response = await axios.get(`${FLOUCI_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${FLOUCI_API_KEY}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error verifying Flouci payment:', error);
    throw error;
  }
}

