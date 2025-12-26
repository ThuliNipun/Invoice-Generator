import React from 'react';
import { InvoiceState } from '../types';
import { Phone, MapPin, Mail, Cake } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceState;
  calculateTotal: () => number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, calculateTotal }) => {
  const total = calculateTotal();

  return (
    <div 
      id="invoice-preview"
      className="w-[210mm] min-h-[297mm] mx-auto bg-[#fdfbf7] p-8 md:p-12 relative shadow-lg text-gray-800 flex flex-col box-border"
    >
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center justify-center mb-8 shrink-0">
        {data.logoSrc ? (
            <img 
                src={data.logoSrc} 
                alt="H&J Cakes Logo" 
                className="h-28 object-contain mb-2" 
            />
        ) : (
            <div className="flex flex-col items-center select-none">
                <div className="flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-brand-primary tracking-tighter">H</span>
                    <div className="flex flex-col items-center mx-1 -mt-2">
                        <Cake size={20} className="text-brand-primary mb-1" />
                        <span className="text-2xl font-bold text-brand-primary">&</span>
                    </div>
                    <span className="text-5xl font-extrabold text-brand-primary tracking-tighter">J</span>
                </div>
                <span className="text-xl font-bold text-brand-primary tracking-[0.2em] mt-0">CAKES</span>
            </div>
        )}
      </div>

      {/* Invoice Title & Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-4 uppercase tracking-tight">INVOICE</h1>
          <div className="space-y-1 text-sm md:text-base">
            <p><span className="text-gray-600 font-medium">Invoice No:</span> <span className="font-semibold">{data.invoice.number}</span></p>
            <p><span className="text-gray-600 font-medium">Date:</span> {data.invoice.date}</p>
          </div>
        </div>

        <div className="text-right sm:text-left">
          <h3 className="text-xl font-bold text-black mb-2">Billed To:</h3>
          <div className="space-y-1 text-sm md:text-base">
            <p className="font-bold text-gray-900">{data.customer.name}</p>
            <p className="text-gray-600 whitespace-pre-wrap">{data.customer.address}</p>
            <p className="text-gray-600">{data.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 flex-grow">
        {/* Table Header */}
        <div className="bg-brand-primary text-white rounded-lg px-6 py-2 grid grid-cols-12 gap-4 font-semibold text-sm mb-4 print:bg-brand-primary print:text-white print-color-adjust-exact">
          <div className="col-span-5">Description</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        {/* Table Body */}
        <div className="space-y-3 px-2">
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 text-sm md:text-base border-b border-gray-200 pb-2 last:border-0 items-center">
              <div className="col-span-5 font-medium text-gray-800">{item.description}</div>
              <div className="col-span-3 text-right text-gray-600">{item.price.toLocaleString('en-LK')}</div>
              <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
              <div className="col-span-2 text-right font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString('en-LK')}</div>
            </div>
          ))}
          {data.items.length === 0 && (
             <div className="text-center py-8 text-gray-400 italic">No items added yet</div>
          )}
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8 shrink-0">
        <div className="flex items-center bg-brand-primary text-white rounded-lg px-8 py-3 shadow-sm print:bg-brand-primary print:text-white print-color-adjust-exact">
            <span className="text-lg font-semibold mr-8">Total</span>
            <span className="text-xl font-bold">Rs. {total.toLocaleString('en-LK')}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="mb-8 px-2 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Terms and Conditions</h3>
          <p className="text-sm text-gray-600">Free purchase without receipt</p>
      </div>

      {/* Footer / Payment & Contact */}
      {/* Used margin-top-auto to push to bottom, but added print:fixed-bottom safely via flex layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative shrink-0">
        
        {/* Payment Details Container */}
        <div className="relative border border-brand-primary rounded-2xl rounded-bl-none p-5 pr-8 bg-white/50">
            <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-black">Payment Detail:</h3>
                <div className="bg-[#005b9f] text-white text-[10px] font-bold px-2 py-0.5 rounded select-none print-color-adjust-exact">
                    COMMERCIAL BANK
                </div>
            </div>
            
            <div className="space-y-1 text-gray-800 text-sm">
                <div className="grid grid-cols-[100px_1fr]">
                    <span className="font-medium text-gray-600">Bank</span>
                    <span>: {data.payment.bankName}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                    <span className="font-medium text-gray-600">Acc Name</span>
                    <span>: {data.payment.accountName}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                    <span className="font-medium text-gray-600">Acc No</span>
                    <span className="font-mono font-medium text-base">: {data.payment.accountNumber}</span>
                </div>
            </div>
        </div>

        {/* Company Contact Info */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-2 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">H & J Cakes</h2>
            
            <div className="flex items-start gap-2 md:flex-row-reverse text-gray-700 text-sm">
                <MapPin className="mt-0.5 flex-shrink-0 text-brand-primary" size={16} />
                <p className="max-w-[200px] leading-tight">{data.company.address}</p>
            </div>
            
            <div className="flex items-center gap-2 md:flex-row-reverse text-gray-700 text-sm">
                <Phone className="flex-shrink-0 text-brand-primary" size={16} />
                <p>{data.company.phone}</p>
            </div>
            
            <div className="flex items-center gap-2 md:flex-row-reverse text-gray-700 text-sm">
                <Mail className="flex-shrink-0 text-brand-primary" size={16} />
                <p>{data.company.email}</p>
            </div>
        </div>

      </div>
    </div>
  );
};