import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { participantService } from '../services/api';
import { Participant } from '../types';

const emptyParticipant: Participant = {
  id: '',
  ndis_number: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  phone_number: '',
  address_street: '',
  address_suburb: '',
  address_state: '',
  address_postcode: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship: '',
  notes: '',
  status: 'active',
};

export const ParticipantPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant>(emptyParticipant);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const res = await participantService.getById(id);
        setParticipant(res.data.data || res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load participant');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParticipant((p) => ({ ...p, [name]: value } as Participant));
  };

  const handleSave = async () => {
    setError('');
    try {
      await participantService.update(participant.id, participant);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save participant');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Participant</h1>
            <p className="text-gray-600">{participant.first_name} {participant.last_name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-200 rounded">Back</button>
            <button onClick={() => setEditing((s) => !s)} className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? 'Cancel' : 'Edit'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input name="first_name" value={participant.first_name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input name="last_name" value={participant.last_name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">NDIS Number</label>
                <input name="ndis_number" value={participant.ndis_number} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={participant.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input name="phone_number" value={participant.phone_number} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea name="notes" value={participant.notes} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Name</h3>
                <p className="mt-1">{participant.first_name} {participant.last_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">NDIS Number</h3>
                <p className="mt-1">{participant.ndis_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Email</h3>
                <p className="mt-1">{participant.email || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Phone</h3>
                <p className="mt-1">{participant.phone_number || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-600">Notes</h3>
                <p className="mt-1">{participant.notes || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParticipantPage;
