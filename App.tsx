import React, { useState } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceState } from './types';

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
  logoSrc: '' // Start with no custom logo
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
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Editor Panel - Hidden when printing */}
      <div className="w-full md:w-96 flex-shrink-0 h-auto md:h-screen md:sticky top-0 z-10 print:hidden border-b md:border-b-0 md:border-r border-gray-200">
        <EditorPanel 
          data={data} 
          setData={setData} 
          onPrint={handlePrint} 
        />
      </div>

      {/* Preview Area */}
      <div className="flex-grow p-4 md:p-8 overflow-auto bg-gray-500 print:p-0 print:bg-white print:overflow-visible">
        <div className="print:hidden mb-4 text-white text-center text-sm opacity-80">
          Preview (A4 Size)
        </div>
        
        {/* The Invoice Paper */}
        <div className="mx-auto shadow-2xl print:shadow-none print:w-full print:absolute print:top-0 print:left-0">
          <InvoicePreview 
            data={data} 
            calculateTotal={calculateTotal} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;