import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHAPA_TEST_PRIV_nb60fCbRuJN__Wd3K9HZvFVLbc21Ty8V2pJjlMrJ';
const CHAPA_PUBLIC_KEY = process.env.VITE_CHAPA_PUBLIC_KEY || 'CHAPA_TEST_PUB_OWG7hG300ypX1NOGd5GbzltdrjWwEvFAx1qSff_L';
const MERCHANT_PHONE = '0941574759';

// API: Initialize Chapa payment session
app.post('/api/chapa/initialize', async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phone, txRef, returnUrl } = req.body;
    const finalTxRef = txRef || `CB-TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const chapaPayload = {
      amount: String(amount || 100),
      currency: 'ETB',
      email: email || 'player@cashbet.et',
      first_name: firstName || 'Cash',
      last_name: lastName || 'Bettor',
      phone_number: phone || MERCHANT_PHONE,
      tx_ref: finalTxRef,
      return_url: returnUrl || undefined,
      customization: {
        title: 'Cash Bet Deposit (ካሽ ቤት)',
        description: `Deposit ${amount} ETB to account. Ref: ${finalTxRef}`,
      },
    };

    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapaPayload),
    });

    const data = await response.json();
    return res.json({
      ...data,
      tx_ref: finalTxRef,
      publicKey: CHAPA_PUBLIC_KEY,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to initialize Chapa payment',
    });
  }
});

// API: Verify Chapa payment status
app.get('/api/chapa/verify/:txRef', async (req, res) => {
  try {
    const { txRef } = req.params;
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to verify transaction',
    });
  }
});

// API: Direct Telebirr / CBE payment receipt submission
app.post('/api/payments/manual-submit', (req, res) => {
  const { amount, method, senderPhone, transactionRef, userId } = req.body;
  const verifiedRef = transactionRef || `${method === 'Telebirr' ? 'TB' : 'CBE'}-${Date.now().toString().slice(-8)}`;

  return res.json({
    status: 'success',
    message: `Payment of ${amount} ETB via ${method} to ${MERCHANT_PHONE} submitted successfully`,
    data: {
      amount: Number(amount),
      method,
      senderPhone,
      receiverPhone: MERCHANT_PHONE,
      transactionRef: verifiedRef,
      verified: true,
      timestamp: new Date().toISOString(),
      userId,
    },
  });
});

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cash Bet server running on http://localhost:${PORT}`);
  });
}

startServer();
