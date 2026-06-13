import React, { useState, useEffect } from 'react';
import { participantService } from '../services/api';
import { Participant } from '../types';

export const DashboardPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await participantService.getAll();
        setParticipants(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Simple participant manager</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/participants/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Participant
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Total Participants</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">{participants.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Active Agreements</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Pending Reviews</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/participants/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Participant</h3>
                <p className="text-gray-600 text-sm">Register new participant</p>
              </div>
              <div className="text-3xl">👤</div>
            </div>
          </a>

          <a
            href="/group-homes"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Group Homes</h3>
                <p className="text-gray-600 text-sm">Manage SIL group homes</p>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
          </a>

          {user?.role === 'admin' && (
            <a
              href="/admin/dashboard"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
                  <p className="text-gray-600 text-sm">View admin dashboard</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </a>
          )}
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Participants</h2>
            <a
              href="/participants/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Participant
            </a>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : error ? (
            <div className="p-6 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      NDIS Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm">{p.ndis_number}</td>
                      <td className="px-6 py-4 text-sm">{p.email || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            p.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/participants/${p.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
