import React, { useState } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceState, InvoiceLayout } from './types';

// Default positions optimized for A4 width (~794px)
const DEFAULT_LAYOUT: InvoiceLayout = {
  logo: { x: 260, y: 40 },
  meta: { x: 40, y: 180 },
  customer: { x: 420, y: 180 },
  table: { x: 40, y: 320 },
  total: { x: 440, y: 550 },
  terms: { x: 40, y: 650 },
  payment: { x: 40, y: 750 },
  company: { x: 450, y: 750 }
};

const INITIAL_STATE: InvoiceState = {
  invoice: {
    number: '0002',
    date: '22 December, 2025'
  },
  customer: {
    name: 'Kandy Fashion',
    address: 'Wattala',
    phone: '+0112 934 222'
  },
  items: [
    { id: '1', description: 'Red velvet Cake', price: 340, quantity: 11 },
    { id: '2', description: 'Marble Cake', price: 195, quantity: 8 },
  ],
  payment: {
    bankName: 'Commercial Bank Matugama',
    accountName: 'B.V.T.T.B. Vithana',
    accountNumber: '8960024372'
  },
  company: {
    address: '115/19D, Yodhayakanthha rd, Alwis Town, Hendala, Wattala',
    phone: '+94 777 00 13 14',
    email: 'thilinitharangi.b@gmail.com'
  },
  logoSrc: '',
  enableCustomLayout: false,
  layout: DEFAULT_LAYOUT
};

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceState>(INITIAL_STATE);

  const calculateTotal = () => {
    return data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:block print:bg-white">
      {/* Editor Panel - Hidden when printing */}
      <div className="w-full md:w-96 flex-shrink-0 h-auto md:h-screen md:sticky top-0 z-10 print:hidden border-b md:border-b-0 md:border-r border-gray-200">
        <EditorPanel 
          data={data} 
          setData={setData} 
          onPrint={handlePrint} 
        />
      </div>

      {/* Preview Area */}
      <div className="flex-grow p-4 md:p-8 overflow-auto bg-gray-500 print:p-0 print:bg-white print:overflow-visible print:block">
        <div className="print:hidden mb-4 text-white text-center text-sm opacity-80 flex justify-center gap-4">
           <span>Preview (A4 Size)</span>
           {data.enableCustomLayout && <span className="bg-yellow-500 text-black px-2 rounded text-xs font-bold flex items-center">Custom Layout Active</span>}
        </div>
        
        {/* The Invoice Paper Wrapper */}
        <div className="mx-auto shadow-2xl print:shadow-none print:mx-0 print:w-full">
          <InvoicePreview 
            data={data} 
            calculateTotal={calculateTotal} 
            onUpdateLayout={(key, x, y) => {
              setData(prev => ({
                ...prev,
                layout: { ...prev.layout, [key]: { x, y } }
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;