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
    <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-[#fdfbf7] p-8 md:p-12 relative shadow-lg print:shadow-none text-gray-800" id="invoice-preview">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center justify-center mb-12">
        {data.logoSrc ? (
            <img 
                src={data.logoSrc} 
                alt="H&J Cakes Logo" 
                className="h-32 md:h-40 object-contain mb-4" 
            />
        ) : (
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">
                    <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">H</span>
                    <div className="flex flex-col items-center mx-1 -mt-2">
                        <Cake size={24} className="text-brand-primary mb-1" />
                        <span className="text-3xl font-bold text-brand-primary">&</span>
                    </div>
                    <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">J</span>
                </div>
                <span className="text-2xl font-bold text-brand-primary tracking-widest mt-0">CAKES</span>
            </div>
        )}
      </div>

      {/* Invoice Title & Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-black mb-6 uppercase tracking-tight">INVOICE</h1>
          <div className="space-y-1 text-lg">
            <p><span className="text-gray-600">Invoice Number:</span> {data.invoice.number}</p>
            <p><span className="text-gray-600">Date:</span> {data.invoice.date}</p>
          </div>
        </div>

        <div className="text-right sm:text-left">
          <h3 className="text-2xl font-bold text-black mb-2">Billed To:</h3>
          <div className="space-y-1 text-lg">
            <p><span className="font-medium">Customer Name:</span> {data.customer.name}</p>
            <p><span className="font-medium">Address:</span> {data.customer.address}</p>
            <p><span className="font-medium">Phone:</span> {data.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        {/* Table Header */}
        <div className="bg-brand-primary text-white rounded-full px-8 py-3 grid grid-cols-12 gap-4 font-semibold text-lg mb-4">
          <div className="col-span-5">Description</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        {/* Table Body */}
        <div className="space-y-4 px-8">
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 text-lg border-b border-gray-200 pb-2 last:border-0">
              <div className="col-span-5 font-medium text-gray-800">{item.description}</div>
              <div className="col-span-3 text-right text-gray-600">{item.price.toLocaleString('en-LK')}</div>
              <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
              <div className="col-span-2 text-right font-semibold text-gray-800">Rs.{(item.price * item.quantity).toLocaleString('en-LK')}</div>
            </div>
          ))}
          {data.items.length === 0 && (
             <div className="text-center py-8 text-gray-400 italic">No items added yet</div>
          )}
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-16">
        <div className="flex items-center bg-brand-primary text-white rounded-full px-8 py-4 shadow-md">
            <span className="text-xl font-semibold mr-8">Total</span>
            <span className="text-2xl font-bold">Rs. {total.toLocaleString('en-LK')}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="mb-12 px-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Terms and Conditions</h3>
          <p className="text-lg text-gray-600">Free purchase without receipt</p>
      </div>

      {/* Footer / Payment & Contact */}
      <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative">
        
        {/* Payment Details Container */}
        <div className="relative border-2 border-brand-primary rounded-[3rem] rounded-bl-none p-6 pr-12">
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-black">Payment Detail:</h3>
                <div className="bg-[#005b9f] text-white text-xs font-bold px-2 py-1 rounded select-none">
                    COMMERCIAL BANK
                </div>
            </div>
            
            <div className="space-y-2 text-gray-800 text-lg">
                <div className="grid grid-cols-[140px_1fr]">
                    <span className="font-medium">Bank</span>
                    <span>: {data.payment.bankName}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr]">
                    <span className="font-medium">Account Name</span>
                    <span>: {data.payment.accountName}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr]">
                    <span className="font-medium text-nowrap">Account Number</span>
                    <span>: {data.payment.accountNumber}</span>
                </div>
            </div>
        </div>

        {/* Company Contact Info */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-3 pb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">H & J Cakes</h2>
            
            <div className="flex items-start gap-3 md:flex-row-reverse text-gray-700">
                <MapPin className="mt-1 flex-shrink-0" size={20} />
                <p className="max-w-[250px]">{data.company.address}</p>
            </div>
            
            <div className="flex items-center gap-3 md:flex-row-reverse text-gray-700">
                <Phone className="flex-shrink-0" size={20} />
                <p>{data.company.phone}</p>
            </div>
            
            <div className="flex items-center gap-3 md:flex-row-reverse text-gray-700">
                <Mail className="flex-shrink-0" size={20} />
                <p>{data.company.email}</p>
            </div>
        </div>

      </div>
    </div>
  );
};