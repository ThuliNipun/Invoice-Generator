import React from 'react';
import { InvoiceState, InvoiceItem } from '../types';
import { Plus, Trash2, Printer, Upload } from 'lucide-react';

interface EditorPanelProps {
  data: InvoiceState;
  setData: React.Dispatch<React.SetStateAction<InvoiceState>>;
  onPrint: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ data, setData, onPrint }) => {
  
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({
      ...prev,
      customer: { ...prev.customer, [e.target.name]: e.target.value }
    }));
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({
      ...prev,
      invoice: { ...prev.invoice, [e.target.name]: e.target.value }
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'New Item',
      price: 0,
      quantity: 1
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logoSrc: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 shadow-xl h-full overflow-y-auto border-r border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Invoice</h2>
        <button 
            type="button"
            onClick={onPrint}
            className="cursor-pointer flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition-all active:scale-95 font-medium shadow-sm select-none"
        >
            <Printer size={18} />
            <span>Print / PDF</span>
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Logo Upload */}
        <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Company Logo</h3>
            <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Upload Logo Image</span>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                    />
                </label>
                {data.logoSrc && (
                    <button 
                        onClick={() => setData(prev => ({...prev, logoSrc: ''}))}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                        Remove
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-400">Recommended: Transparent PNG</p>
        </section>

        {/* Invoice Meta */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input 
                type="text" 
                name="number"
                value={data.invoice.number} 
                onChange={handleInvoiceChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="text" 
                name="date"
                value={data.invoice.date} 
                onChange={handleInvoiceChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>

        {/* Customer Details */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                name="name"
                value={data.customer.name} 
                onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                type="text" 
                name="address"
                value={data.customer.address} 
                onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text" 
                name="phone"
                value={data.customer.phone} 
                onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Items</h3>
            <button 
              onClick={addItem}
              className="flex items-center gap-1 text-sm text-brand-primary hover:text-pink-800 font-medium cursor-pointer"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-400 font-mono">Item {index + 1}</span>
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12">
                    <input 
                      type="text" 
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="text-xs text-gray-500">Price</label>
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};