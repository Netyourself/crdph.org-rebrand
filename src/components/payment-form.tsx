'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const amounts = [250, 500, 1000, 2500];
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PaymentForm() {
  const [selected, setSelected] = useState<number>(500);
  const [custom, setCustom] = useState('');
  const [reference, setReference] = useState('');
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = custom ? Number(custom) : selected;

  async function payWithStripe() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reference }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong starting checkout.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong starting checkout.');
      setLoading(false);
    }
  }

  const methodBtn = (active: boolean) =>
    `flex-1 rounded-lg py-2.5 text-sm font-medium transition ${active ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`;

  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-300">Invoice or engagement reference (optional)</span>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          maxLength={100}
          placeholder="e.g. INV-2026-014"
          className="input"
        />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {amounts.map((amt) => {
          const active = !custom && selected === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelected(amt);
                setCustom('');
              }}
              aria-pressed={active}
              className={`min-h-[48px] rounded-xl border py-3 font-semibold transition ${
                active
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                  : 'border-gray-800 bg-slate-950 text-gray-100 hover:border-cyan-500/50'
              }`}
            >
              ${amt.toLocaleString()}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-gray-300">Or enter an amount (USD)</span>
        <input
          type="number"
          inputMode="decimal"
          min={1}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="e.g. 1500"
          className="input"
        />
      </label>

      <div className="mt-6 flex gap-1 rounded-xl border border-gray-800 bg-slate-950 p-1" role="group" aria-label="Payment method">
        <button type="button" onClick={() => setMethod('stripe')} aria-pressed={method === 'stripe'} className={methodBtn(method === 'stripe')}>
          Card (Stripe)
        </button>
        <button type="button" onClick={() => setMethod('paypal')} aria-pressed={method === 'paypal'} className={methodBtn(method === 'paypal')}>
          PayPal
        </button>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6">
        {method === 'stripe' ? (
          <button
            type="button"
            onClick={payWithStripe}
            disabled={loading || !amount || amount < 1}
            className="btn-gradient w-full"
          >
            {loading ? 'Redirecting to checkout…' : `Pay $${(amount || 0).toLocaleString()} by card`}
          </button>
        ) : paypalClientId ? (
          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
            <PayPalButtons
              style={{ layout: 'horizontal', color: 'gold', label: 'pay' }}
              disabled={!amount || amount < 1}
              createOrder={(_data, actions) =>
                actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      description: 'Payment to CRDPH — Computational Research and Data Processing Hub',
                      custom_id: reference ? reference.slice(0, 127) : undefined,
                      amount: { currency_code: 'USD', value: String(amount) },
                    },
                  ],
                })
              }
              onApprove={async (_data, actions) => {
                await actions.order?.capture();
                window.location.href = '/pay/success';
              }}
              onError={() => setError('PayPal could not process this payment. Please try again.')}
            />
          </PayPalScriptProvider>
        ) : (
          <p className="rounded-xl border border-gray-800 bg-slate-950 p-4 text-sm text-gray-400">
            PayPal isn&apos;t configured yet — set <code className="font-mono text-cyan-300">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to
            enable this option.
          </p>
        )}
      </div>
    </div>
  );
}
