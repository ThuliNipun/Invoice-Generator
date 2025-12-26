import React, { useRef } from 'react';
import { InvoiceState, InvoiceLayout } from '../types';
import { Phone, MapPin, Mail, Cake, GripVertical } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceState;
  calculateTotal: () => number;
  onUpdateLayout?: (key: keyof InvoiceLayout, x: number, y: number) => void;
}

// Wrapper for draggable elements
const DraggableSection: React.FC<{
  id: keyof InvoiceLayout;
  x: number;
  y: number;
  isCustomMode: boolean;
  onUpdate?: (key: keyof InvoiceLayout, x: number, y: number) => void;
  children: React.ReactNode;
  width?: string;
}> = ({ id, x, y, isCustomMode, onUpdate, children, width = 'auto' }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCustomMode || !onUpdate) return;
    
    // Only allow dragging from the handle if present, or the whole container
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onUpdate(id, x + dx, y + dy);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (isCustomMode) {
    return (
      <div 
        ref={ref}
        style={{ left: x, top: y, position: 'absolute', width }}
        className="group hover:z-50"
      >
        <div 
            className="absolute -top-3 -left-3 p-1 bg-brand-primary text-white rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity print:hidden z-10 shadow-sm"
            onMouseDown={handleMouseDown}
        >
            <GripVertical size={14} />
        </div>
        <div className="border border-transparent group-hover:border-dashed group-hover:border-brand-primary/50 rounded transition-all">
            {children}
        </div>
      </div>
    );
  }

  // In auto mode, simply return children (rendering is handled by parent flex flow)
  return <>{children}</>;
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, calculateTotal, onUpdateLayout }) => {
  const total = calculateTotal();
  const { enableCustomLayout, layout } = data;

  // Render components based on mode
  if (enableCustomLayout) {
      return (
        <div 
          id="invoice-preview"
          className="w-[210mm] min-h-[297mm] mx-auto bg-[#fdfbf7] relative shadow-lg text-gray-800 print:mx-0 print:shadow-none overflow-hidden"
        >
          {/* Custom Absolute Layout */}
          
          {/* Logo */}
          <DraggableSection id="logo" x={layout.logo.x} y={layout.logo.y} isCustomMode={true} onUpdate={onUpdateLayout}>
             <div className="flex flex-col items-center justify-center w-[300px]">
                {data.logoSrc ? (
                    <img src={data.logoSrc} alt="Logo" className="h-32 object-contain" />
                ) : (
                    <div className="flex flex-col items-center select-none">
                        <div className="flex items-center justify-center">
                            <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">H</span>
                            <div className="flex flex-col items-center mx-1 -mt-2">
                                <Cake size={24} className="text-brand-primary mb-1" />
                                <span className="text-3xl font-bold text-brand-primary">&</span>
                            </div>
                            <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">J</span>
                        </div>
                        <span className="text-2xl font-bold text-brand-primary tracking-[0.2em] mt-0">CAKES</span>
                    </div>
                )}
             </div>
          </DraggableSection>

          {/* Meta */}
          <DraggableSection id="meta" x={layout.meta.x} y={layout.meta.y} isCustomMode={true} onUpdate={onUpdateLayout}>
             <div className="w-[300px]">
                <h1 className="text-4xl font-extrabold text-black mb-4 uppercase tracking-tight">INVOICE</h1>
                <div className="space-y-1">
                    <p className="text-gray-700">Invoice Number: {data.invoice.number}</p>
                    <p className="text-gray-700">Date: {data.invoice.date}</p>
                </div>
             </div>
          </DraggableSection>

          {/* Customer */}
          <DraggableSection id="customer" x={layout.customer.x} y={layout.customer.y} isCustomMode={true} onUpdate={onUpdateLayout}>
             <div className="w-[300px]">
                <h3 className="text-xl font-bold text-black mb-3">Billed To:</h3>
                <div className="space-y-1">
                    <p className="font-medium text-gray-900">Customer Name: {data.customer.name}</p>
                    <p className="text-gray-700">Address: {data.customer.address}</p>
                    <p className="text-gray-700">Phone: {data.customer.phone}</p>
                </div>
             </div>
          </DraggableSection>

          {/* Table */}
          <DraggableSection id="table" x={layout.table.x} y={layout.table.y} isCustomMode={true} onUpdate={onUpdateLayout} width="715px">
            <div>
                <div className="bg-brand-primary text-white rounded-full px-6 py-3 grid grid-cols-12 gap-4 font-semibold text-lg mb-6 print:bg-brand-primary print:text-white print-color-adjust-exact">
                    <div className="col-span-5 pl-2">Description</div>
                    <div className="col-span-3 text-right">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right pr-2">Amount</div>
                </div>
                <div className="space-y-4 px-4">
                    {data.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 text-lg items-center">
                            <div className="col-span-5 font-medium text-gray-800 pl-2">{item.description}</div>
                            <div className="col-span-3 text-right text-gray-600">{item.price.toLocaleString('en-LK')}</div>
                            <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                            <div className="col-span-2 text-right font-semibold text-gray-900 pr-2">Rs.{(item.price * item.quantity).toLocaleString('en-LK')}</div>
                        </div>
                    ))}
                </div>
            </div>
          </DraggableSection>

          {/* Total */}
          <DraggableSection id="total" x={layout.total.x} y={layout.total.y} isCustomMode={true} onUpdate={onUpdateLayout}>
             <div className="flex items-center bg-brand-primary text-white rounded-full px-10 py-4 shadow-sm print:bg-brand-primary print:text-white print-color-adjust-exact w-max">
                <span className="text-xl font-medium mr-12">Total</span>
                <span className="text-2xl font-bold">Rs. {total.toLocaleString('en-LK')}</span>
             </div>
          </DraggableSection>

          {/* Terms */}
          <DraggableSection id="terms" x={layout.terms.x} y={layout.terms.y} isCustomMode={true} onUpdate={onUpdateLayout} width="350px">
             <div className="grid grid-cols-1 gap-2">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Terms and Conditions</h3>
                    <p className="text-gray-600">Free purchase without receipt</p>
                </div>
                <div className="pt-2">
                    <h3 className="text-xl font-bold text-gray-900">Returns</h3>
                </div>
             </div>
          </DraggableSection>

          {/* Payment */}
          <DraggableSection id="payment" x={layout.payment.x} y={layout.payment.y} isCustomMode={true} onUpdate={onUpdateLayout} width="400px">
            <div className="relative border-2 border-brand-primary rounded-[2rem] rounded-bl-none p-6 bg-white/50 print:bg-transparent">
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-black">Payment Detail:</h3>
                    <div className="bg-[#005b9f] text-white text-[10px] font-bold px-2 py-1 rounded select-none print-color-adjust-exact">
                        COMMERCIAL BANK
                    </div>
                </div>
                
                <div className="space-y-2 text-gray-800 text-base">
                    <div className="grid grid-cols-[130px_1fr]">
                        <span className="font-medium text-gray-600">Bank</span>
                        <span>: {data.payment.bankName}</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr]">
                        <span className="font-medium text-gray-600">Account Name</span>
                        <span>: {data.payment.accountName}</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr]">
                        <span className="font-medium text-gray-600">Account Number</span>
                        <span className="font-mono font-medium text-lg">: {data.payment.accountNumber}</span>
                    </div>
                </div>
            </div>
          </DraggableSection>

          {/* Company Footer */}
          <DraggableSection id="company" x={layout.company.x} y={layout.company.y} isCustomMode={true} onUpdate={onUpdateLayout} width="300px">
             <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-3">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">H & J Cakes</h2>
                <div className="flex items-start gap-3 md:flex-row-reverse text-gray-600">
                    <MapPin className="mt-1 flex-shrink-0" size={18} />
                    <p className="max-w-[250px] leading-snug">{data.company.address}</p>
                </div>
                <div className="flex items-center gap-3 md:flex-row-reverse text-gray-600">
                    <Phone className="flex-shrink-0" size={18} />
                    <p>{data.company.phone}</p>
                </div>
                <div className="flex items-center gap-3 md:flex-row-reverse text-gray-600">
                    <Mail className="flex-shrink-0" size={18} />
                    <p>{data.company.email}</p>
                </div>
             </div>
          </DraggableSection>

        </div>
      );
  }

  // STANDARD FLEX LAYOUT (AUTO)
  return (
    <div 
      id="invoice-preview"
      className="w-[210mm] min-h-[297mm] mx-auto bg-[#fdfbf7] p-12 relative shadow-lg text-gray-800 flex flex-col print:mx-0 print:p-8"
    >
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center justify-center mb-8">
        {data.logoSrc ? (
            <img 
                src={data.logoSrc} 
                alt="H&J Cakes Logo" 
                className="h-32 object-contain" 
            />
        ) : (
            <div className="flex flex-col items-center select-none">
                <div className="flex items-center justify-center">
                    <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">H</span>
                    <div className="flex flex-col items-center mx-1 -mt-2">
                        <Cake size={24} className="text-brand-primary mb-1" />
                        <span className="text-3xl font-bold text-brand-primary">&</span>
                    </div>
                    <span className="text-6xl font-extrabold text-brand-primary tracking-tighter">J</span>
                </div>
                <span className="text-2xl font-bold text-brand-primary tracking-[0.2em] mt-0">CAKES</span>
            </div>
        )}
      </div>

      {/* Invoice Title & Details Grid */}
      <div className="flex justify-between items-start mb-10">
        <div className="w-1/2">
          <h1 className="text-4xl font-extrabold text-black mb-4 uppercase tracking-tight">INVOICE</h1>
          <div className="space-y-1">
            <p className="text-gray-700">Invoice Number: {data.invoice.number}</p>
            <p className="text-gray-700">Date: {data.invoice.date}</p>
          </div>
        </div>

        <div className="w-1/2 text-left pl-10">
          <h3 className="text-xl font-bold text-black mb-3">Billed To:</h3>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Customer Name: {data.customer.name}</p>
            <p className="text-gray-700">Address: {data.customer.address}</p>
            <p className="text-gray-700">Phone: {data.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Table - This section grows */}
      <div className="flex-grow mb-8">
        {/* Table Header */}
        <div className="bg-brand-primary text-white rounded-full px-6 py-3 grid grid-cols-12 gap-4 font-semibold text-lg mb-6 print:bg-brand-primary print:text-white print-color-adjust-exact">
          <div className="col-span-5 pl-2">Description</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right pr-2">Amount</div>
        </div>

        {/* Table Body */}
        <div className="space-y-4 px-4">
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 text-lg items-center item-row">
              <div className="col-span-5 font-medium text-gray-800 pl-2">{item.description}</div>
              <div className="col-span-3 text-right text-gray-600">{item.price.toLocaleString('en-LK')}</div>
              <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
              <div className="col-span-2 text-right font-semibold text-gray-900 pr-2">Rs.{(item.price * item.quantity).toLocaleString('en-LK')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section (Totals, Terms, Payment) - Kept together */}
      <div className="mt-auto break-inside-avoid">
        {/* Totals Section */}
        <div className="flex justify-end mb-10">
          <div className="flex items-center bg-brand-primary text-white rounded-full px-10 py-4 shadow-sm print:bg-brand-primary print:text-white print-color-adjust-exact">
              <span className="text-xl font-medium mr-12">Total</span>
              <span className="text-2xl font-bold">Rs. {total.toLocaleString('en-LK')}</span>
          </div>
        </div>

        {/* Terms */}
        <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Terms and Conditions</h3>
                <p className="text-gray-600">Free purchase without receipt</p>
            </div>
            <div className="text-right pt-2">
                 <h3 className="text-xl font-bold text-gray-900">Returns</h3>
            </div>
        </div>

        {/* Bottom Footer / Payment & Contact */}
        <div className="flex flex-col md:flex-row gap-8 items-end border-t-2 border-brand-primary/20 pt-8">
          
          {/* Payment Details Container */}
          <div className="w-full md:w-1/2 relative border-2 border-brand-primary rounded-[2rem] rounded-bl-none p-6 bg-white/50 print:bg-transparent">
              <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-black">Payment Detail:</h3>
                  <div className="bg-[#005b9f] text-white text-[10px] font-bold px-2 py-1 rounded select-none print-color-adjust-exact">
                      COMMERCIAL BANK
                  </div>
              </div>
              
              <div className="space-y-2 text-gray-800 text-base">
                  <div className="grid grid-cols-[130px_1fr]">
                      <span className="font-medium text-gray-600">Bank</span>
                      <span>: {data.payment.bankName}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr]">
                      <span className="font-medium text-gray-600">Account Name</span>
                      <span>: {data.payment.accountName}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr]">
                      <span className="font-medium text-gray-600">Account Number</span>
                      <span className="font-mono font-medium text-lg">: {data.payment.accountNumber}</span>
                  </div>
              </div>
          </div>

          {/* Company Contact Info */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right space-y-3">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">H & J Cakes</h2>
              
              <div className="flex items-start gap-3 md:flex-row-reverse text-gray-600">
                  <MapPin className="mt-1 flex-shrink-0" size={18} />
                  <p className="max-w-[250px] leading-snug">{data.company.address}</p>
              </div>
              
              <div className="flex items-center gap-3 md:flex-row-reverse text-gray-600">
                  <Phone className="flex-shrink-0" size={18} />
                  <p>{data.company.phone}</p>
              </div>
              
              <div className="flex items-center gap-3 md:flex-row-reverse text-gray-600">
                  <Mail className="flex-shrink-0" size={18} />
                  <p>{data.company.email}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};