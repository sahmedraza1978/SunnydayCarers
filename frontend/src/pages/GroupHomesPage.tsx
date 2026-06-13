import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface GroupHome {
  id: string;
  name: string;
  location_street: string;
  location_suburb: string;
  location_postcode: string;
  location_state: string;
  bedrooms: number;
  bathrooms: number;
  assistance_type: string;
  max_capacity: number;
  current_occupancy: number;
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  wheelchair_accessible: boolean;
  has_yard: boolean;
  has_kitchen: boolean;
  notes: string;
  status: string;
  created_at: string;
}

const GroupHomesPage: React.FC = () => {
  const [groupHomes, setGroupHomes] = useState<GroupHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<GroupHome>>({
    bedrooms: 3,
    bathrooms: 2,
    has_kitchen: true,
    wheelchair_accessible: false,
    has_yard: false,
    status: 'active',
  });

  useEffect(() => {
    fetchGroupHomes();
  }, []);

  const fetchGroupHomes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/group-homes');
      setGroupHomes(response.data.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch group homes:', err);
      setError('Failed to load group homes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/group-homes', formData);
      setFormData({
        bedrooms: 3,
        bathrooms: 2,
        has_kitchen: true,
        wheelchair_accessible: false,
        has_yard: false,
        status: 'active',
      });
      setShowForm(false);
      await fetchGroupHomes();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create group home');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this group home?')) return;

    try {
      await api.delete(`/group-homes/${id}`);
      await fetchGroupHomes();
    } catch (err) {
      console.error('Failed to delete group home:', err);
      setError('Failed to delete group home');
    }
  };

  const occupancyPercentage = (home: GroupHome) => {
    if (!home.max_capacity) return 0;
    return Math.round((home.current_occupancy / home.max_capacity) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Group Homes</h1>
              <p className="text-gray-600 mt-2">Manage SIL group homes and facilities</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Group Home'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add Group Home Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Group Home</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Group Home Name"
                required
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              {/* Address */}
              <input
                type="text"
                placeholder="Street Address"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location_street || ''}
                onChange={(e) => setFormData({ ...formData, location_street: e.target.value })}
              />
              <input
                type="text"
                placeholder="Suburb"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location_suburb || ''}
                onChange={(e) => setFormData({ ...formData, location_suburb: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postcode"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location_postcode || ''}
                onChange={(e) => setFormData({ ...formData, location_postcode: e.target.value })}
              />
              <select
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location_state || ''}
                onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
              >
                <option value="">Select State</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>

              {/* Bedrooms & Bathrooms */}
              <input
                type="number"
                placeholder="Bedrooms"
                required
                min="1"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.bedrooms || ''}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Bathrooms"
                required
                min="1"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.bathrooms || ''}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
              />

              {/* Capacity */}
              <input
                type="number"
                placeholder="Max Capacity"
                min="1"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.max_capacity || ''}
                onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) })}
              />

              {/* Assistance Type */}
              <input
                type="text"
                placeholder="Assistance Type (e.g., SIL, Supported Living)"
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.assistance_type || ''}
                onChange={(e) => setFormData({ ...formData, assistance_type: e.target.value })}
              />

              {/* Contact Person */}
              <input
                type="text"
                placeholder="Contact Person Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contact_person_name || ''}
                onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Contact Person Phone"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contact_person_phone || ''}
                onChange={(e) => setFormData({ ...formData, contact_person_phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Contact Person Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contact_person_email || ''}
                onChange={(e) => setFormData({ ...formData, contact_person_email: e.target.value })}
              />

              {/* Manager */}
              <input
                type="text"
                placeholder="Manager Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.manager_name || ''}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Manager Phone"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.manager_phone || ''}
                onChange={(e) => setFormData({ ...formData, manager_phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Manager Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.manager_email || ''}
                onChange={(e) => setFormData({ ...formData, manager_email: e.target.value })}
              />

              {/* Amenities */}
              <div className="col-span-2 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.wheelchair_accessible || false}
                    onChange={(e) =>
                      setFormData({ ...formData, wheelchair_accessible: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">Wheelchair Accessible</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_yard || false}
                    onChange={(e) => setFormData({ ...formData, has_yard: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">Has Yard</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_kitchen !== false}
                    onChange={(e) => setFormData({ ...formData, has_kitchen: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">Has Kitchen</span>
                </label>
              </div>

              {/* Notes */}
              <textarea
                placeholder="Additional Notes"
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Group Home
              </button>
            </form>
          </div>
        )}

        {/* Group Homes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading group homes...</p>
          </div>
        ) : groupHomes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No group homes yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupHomes.map((home) => (
              <div key={home.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                  <h3 className="text-lg font-bold">{home.name}</h3>
                  <p className="text-blue-100 text-sm">
                    {home.location_suburb}, {home.location_state}
                  </p>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Address */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 font-medium">ADDRESS</p>
                    <p className="text-sm text-gray-900">
                      {home.location_street}, {home.location_suburb} {home.location_postcode}
                    </p>
                  </div>

                  {/* Facilities */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Bedrooms</p>
                      <p className="text-lg font-bold text-blue-600">{home.bedrooms}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Bathrooms</p>
                      <p className="text-lg font-bold text-blue-600">{home.bathrooms}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Capacity</p>
                      <p className="text-lg font-bold text-blue-600">
                        {home.max_capacity || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  {home.max_capacity && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Occupancy</span>
                        <span className="font-bold text-gray-900">
                          {home.current_occupancy}/{home.max_capacity} ({occupancyPercentage(home)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition ${
                            occupancyPercentage(home) > 80
                              ? 'bg-red-500'
                              : occupancyPercentage(home) > 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${occupancyPercentage(home)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Assistance Type */}
                  {home.assistance_type && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 font-medium">ASSISTANCE TYPE</p>
                      <p className="text-sm text-gray-900">{home.assistance_type}</p>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {home.wheelchair_accessible && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ♿ Accessible
                      </span>
                    )}
                    {home.has_yard && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        🌳 Yard
                      </span>
                    )}
                    {home.has_kitchen && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        🍳 Kitchen
                      </span>
                    )}
                  </div>

                  {/* Contact */}
                  {home.contact_person_name && (
                    <div className="mb-3 pb-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 font-medium mt-3">CONTACT PERSON</p>
                      <p className="text-sm text-gray-900">{home.contact_person_name}</p>
                      {home.contact_person_phone && (
                        <p className="text-xs text-blue-600">{home.contact_person_phone}</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(home.id)}
                    className="w-full bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupHomesPage;
