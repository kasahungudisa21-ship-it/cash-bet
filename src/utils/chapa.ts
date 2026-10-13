export interface ChapaInitResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    checkout_url: string;
  };
  tx_ref?: string;
  publicKey?: string;
}

export const initializeChapaPayment = async (params: {
  amount: number;
  phone: string;
  fullName: string;
  email?: string;
}): Promise<ChapaInitResponse> => {
  try {
    const txRef = `CB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const res = await fetch('/api/chapa/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        phone: params.phone,
        firstName: params.fullName.split(' ')[0] || 'CashBet',
        lastName: params.fullName.split(' ')[1] || 'Player',
        email: params.email || `${params.phone}@cashbet.et`,
        txRef,
        returnUrl: window.location.href,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data: ChapaInitResponse = await res.json();
    return data;
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Chapa network error',
    };
  }
};

export const verifyChapaPayment = async (txRef: string) => {
  try {
    const res = await fetch(`/api/chapa/verify/${txRef}`);
    return await res.json();
  } catch {
    return { status: 'error' };
  }
};
