import React, { useState } from 'react';
import { Camera, Calendar, Clock, Plus, Trash2, Edit2, Building, DollarSign, RefreshCw } from 'lucide-react';

interface License {
  id: string;
  photoUrl: string;
  photographerName: string;
  licenseType: string;
  startDate: string;
  expiryDate: string;
  usageRights: string[];
  status: 'active' | 'expired' | 'expiring-soon';
  clientName: string;
  clientEmail: string;
  price: number;
  renewalTerms: string;
  autoRenewal: boolean;
}

function App() {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      photoUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      photographerName: 'John Smith',
      licenseType: 'Commercial',
      startDate: '2024-03-01',
      expiryDate: '2024-12-31',
      usageRights: ['Web', 'Print', 'Social Media'],
      status: 'active',
      clientName: 'Acme Corp',
      clientEmail: 'licensing@acme.com',
      price: 499.99,
      renewalTerms: 'Annual renewal at current market rate',
      autoRenewal: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [newLicense, setNewLicense] = useState<Partial<License>>({
    usageRights: [],
    autoRenewal: false,
    price: 0
  });

  const addLicense = () => {
    if (newLicense.photoUrl && newLicense.photographerName && newLicense.licenseType) {
      const status = calculateStatus(newLicense.expiryDate || '');
      setLicenses([...licenses, {
        ...newLicense as License,
        id: Date.now().toString(),
        status
      }]);
      setShowAddModal(false);
      setNewLicense({ usageRights: [], autoRenewal: false, price: 0 });
    }
  };

  const startEditing = (license: License) => {
    setEditingLicense(license);
    setShowEditModal(true);
  };

  const updateLicense = () => {
    if (editingLicense) {
      const status = calculateStatus(editingLicense.expiryDate);
      setLicenses(licenses.map(license => 
        license.id === editingLicense.id 
          ? { ...editingLicense, status }
          : license
      ));
      setShowEditModal(false);
      setEditingLicense(null);
    }
  };

  const calculateStatus = (expiryDate: string): 'active' | 'expired' | 'expiring-soon' => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry < today) return 'expired';
    if (expiry <= thirtyDaysFromNow) return 'expiring-soon';
    return 'active';
  };

  const deleteLicense = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Photo License Manager</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add License
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {licenses.map(license => (
            <div key={license.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 overflow-hidden">
                <img
                  src={license.photoUrl}
                  alt={`Licensed photo by ${license.photographerName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{license.photographerName}</h3>
                    <p className="text-sm text-gray-500">{license.licenseType}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(license.status)}`}>
                    {license.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{license.clientName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Valid until: {new Date(license.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatPrice(license.price)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>{license.autoRenewal ? 'Auto-renewal enabled' : 'Manual renewal'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {license.usageRights.map((right, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {right}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => deleteLicense(license.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => startEditing(license)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New License</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.photoUrl || ''}
                  onChange={e => setNewLicense({...newLicense, photoUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Photographer Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.photographerName || ''}
                  onChange={e => setNewLicense({...newLicense, photographerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.clientName || ''}
                  onChange={e => setNewLicense({...newLicense, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.clientEmail || ''}
                  onChange={e => setNewLicense({...newLicense, clientEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.licenseType || ''}
                  onChange={e => setNewLicense({...newLicense, licenseType: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.price || ''}
                  onChange={e => setNewLicense({...newLicense, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.expiryDate || ''}
                  onChange={e => setNewLicense({...newLicense, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Renewal Terms</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newLicense.renewalTerms || ''}
                  onChange={e => setNewLicense({...newLicense, renewalTerms: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    checked={newLicense.autoRenewal || false}
                    onChange={e => setNewLicense({...newLicense, autoRenewal: e.target.checked})}
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable Auto-Renewal</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Rights</label>
                <div className="mt-2 space-x-2">
                  {['Web', 'Print', 'Social Media', 'Advertising'].map(right => (
                    <label key={right} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        checked={newLicense.usageRights?.includes(right)}
                        onChange={e => {
                          const rights = new Set(newLicense.usageRights);
                          e.target.checked ? rights.add(right) : rights.delete(right);
                          setNewLicense({...newLicense, usageRights: Array.from(rights)});
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-600">{right}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addLicense}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add License
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit License</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.photoUrl}
                  onChange={e => setEditingLicense({...editingLicense, photoUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Photographer Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.photographerName}
                  onChange={e => setEditingLicense({...editingLicense, photographerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.clientName}
                  onChange={e => setEditingLicense({...editingLicense, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.clientEmail}
                  onChange={e => setEditingLicense({...editingLicense, clientEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.licenseType}
                  onChange={e => setEditingLicense({...editingLicense, licenseType: e.target.value})}
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.price}
                  onChange={e => setEditingLicense({...editingLicense, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.expiryDate}
                  onChange={e => setEditingLicense({...editingLicense, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Renewal Terms</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingLicense.renewalTerms}
                  onChange={e => setEditingLicense({...editingLicense, renewalTerms: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    checked={editingLicense.autoRenewal}
                    onChange={e => setEditingLicense({...editingLicense, autoRenewal: e.target.checked})}
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable Auto-Renewal</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Rights</label>
                <div className="mt-2 space-x-2">
                  {['Web', 'Print', 'Social Media', 'Advertising'].map(right => (
                    <label key={right} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        checked={editingLicense.usageRights.includes(right)}
                        onChange={e => {
                          const rights = new Set(editingLicense.usageRights);
                          e.target.checked ? rights.add(right) : rights.delete(right);
                          setEditingLicense({...editingLicense, usageRights: Array.from(rights)});
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-600">{right}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLicense(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={updateLicense}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;