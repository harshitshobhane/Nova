import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRData {
  id: number;
  label: string;
  upiId: string;
  businessName: string;
  type: 'Dynamic Amount' | 'Fixed Amount';
  amount?: string;
  description?: string;
  created: string;
}

const initialQRCodes: QRData[] = [];

const QRCodePage = () => {
  const [form, setForm] = useState({
    label: '',
    upiId: '',
    businessName: '',
    type: 'Dynamic Amount',
    amount: '',
    description: '',
  });
  const [qrCodes, setQRCodes] = useState<QRData[]>(initialQRCodes);
  const [preview, setPreview] = useState('');

  // UPI QR string generator
  const getUPIString = () => {
    let str = `upi://pay?pa=${form.upiId}&pn=${encodeURIComponent(form.businessName)}`;
    if (form.amount && form.type === 'Fixed Amount') str += `&am=${form.amount}`;
    if (form.description) str += `&tn=${encodeURIComponent(form.description)}`;
    return str;
  };

  // Live preview
  React.useEffect(() => {
    setPreview(getUPIString());
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.upiId || !form.businessName) return;
    setQRCodes([
      {
        id: Date.now(),
        label: form.label,
        upiId: form.upiId,
        businessName: form.businessName,
        type: form.type as 'Dynamic Amount' | 'Fixed Amount',
        amount: form.type === 'Fixed Amount' ? form.amount : undefined,
        description: form.description,
        created: new Date().toLocaleDateString(),
      },
      ...qrCodes,
    ]);
    setForm({ label: '', upiId: '', businessName: '', type: 'Dynamic Amount', amount: '', description: '' });
  };

  const handleDownload = (id: number) => {
    const canvas = document.getElementById(`qr-canvas-${id}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      a.click();
    }
  };

  const handleCopy = (id: number) => {
    const qr = qrCodes.find(q => q.id === id);
    if (qr) {
      navigator.clipboard.writeText(
        `upi://pay?pa=${qr.upiId}&pn=${encodeURIComponent(qr.businessName)}${qr.amount ? `&am=${qr.amount}` : ''}${qr.description ? `&tn=${encodeURIComponent(qr.description)}` : ''}`
      );
    }
  };

  const handleDelete = (id: number) => {
    setQRCodes(qrCodes.filter(q => q.id !== id));
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-start px-2 sm:px-4 md:px-0 pt-4 pb-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#23263a] tracking-tight">QR Code Management</h1>
          <p className="text-gray-500 mb-6">Create and manage payment QR codes for your business</p>
          <form className="flex flex-col gap-4 md:gap-6" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">QR Code Name *</label>
                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                  placeholder="Store Counter, Delivery, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">QR Code Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                >
                  <option value="Dynamic Amount">Dynamic Amount</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                  placeholder="business@upi"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                  placeholder="Your Business Name"
                  required
                />
              </div>
            </div>
            {form.type === 'Fixed Amount' && (
              <div>
                <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                  placeholder="500"
                  min="1"
                />
              </div>
            )}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-[#7c3aed] mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-[#a78bfa] rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-white/80 text-base md:text-lg font-medium"
                placeholder="Payment for goods/services"
                rows={2}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 mb-1">Live Preview</span>
                <div className="bg-white rounded-xl p-2 border border-[#e0e7ff] shadow">
                  <QRCodeSVG id="qr-preview" value={preview} size={120} level="H" includeMargin={true} />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto mt-2 px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-xl font-semibold hover:from-[#5b21b6] hover:to-[#7c3aed] transition text-base shadow-lg"
              >
                Create QR Code
              </button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-4 flex flex-col items-center">
              <QRCodeSVG id={`qr-canvas-${qr.id}`} value={`upi://pay?pa=${qr.upiId}&pn=${encodeURIComponent(qr.businessName)}${qr.amount ? `&am=${qr.amount}` : ''}${qr.description ? `&tn=${encodeURIComponent(qr.description)}` : ''}`} size={120} level="H" includeMargin={true} />
              <div className="mt-3 mb-1 text-base font-semibold text-[#23263a] text-center">{qr.label}</div>
              <div className="text-xs text-gray-500 mb-2 text-center">{qr.businessName}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#ede9fe] text-[#7c3aed] text-xs font-medium">{qr.type === 'Dynamic Amount' ? 'dynamic amount' : 'fixed amount'}</span>
                {qr.amount && <span className="px-2 py-0.5 rounded bg-[#fef9c3] text-[#b45309] text-xs font-medium">₹{qr.amount}</span>}
                <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#15803d] text-xs font-medium">Active</span>
              </div>
              <div className="text-xs text-gray-400 mb-2">Created: {qr.created}</div>
              <div className="flex gap-2 w-full">
                <button onClick={() => handleCopy(qr.id)} className="flex-1 px-3 py-1 bg-[#ede9fe] text-[#7c3aed] rounded hover:bg-[#c7d2fe] text-xs font-medium">Copy</button>
                <button onClick={() => handleDownload(qr.id)} className="flex-1 px-3 py-1 bg-[#fef9c3] text-[#b45309] rounded hover:bg-[#fde68a] text-xs font-medium">Download</button>
                <button onClick={() => handleDelete(qr.id)} className="flex-1 px-3 py-1 bg-[#fee2e2] text-[#ef4444] rounded hover:bg-[#fecaca] text-xs font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodePage; 