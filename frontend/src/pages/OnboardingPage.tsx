import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type ServiceType = 'sil_group_home' | 'sil_and_cp' | 'in_home_support' | 'day_program' | null;
type ManagedBy = 'coordinator' | 'planner' | null;

export const OnboardingPage = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    service_type: null as ServiceType,
    managed_by: null as ManagedBy,
    support_coordinator_name: '',
    support_coordinator_phone: '',
    support_coordinator_email: '',
    planner_name: '',
    planner_phone: '',
    planner_email: '',
    planner_organization: '',
    group_home_name: '',
    group_home_address: '',
    group_home_phone: '',
    in_home_support_start_date: '',
    day_program_name: '',
    day_program_days: '',
    additional_notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        participant_id: participantId,
        ...formData,
      };

      await api.post('/onboarding', payload);
      navigate(`/participants/${participantId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 1: Service Type</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-4">
          Which services will this participant receive? *
        </label>
        <div className="space-y-3">
          {[
            { value: 'sil_group_home', label: '1. SIL - Group Home' },
            { value: 'sil_and_cp', label: '2. SIL + CP (Capacity Building)' },
            { value: 'in_home_support', label: '3. In-Home Care Support' },
            { value: 'day_program', label: '4. Day Program' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="service_type"
                value={option.value}
                checked={formData.service_type === option.value}
                onChange={handleChange}
                className="mr-3"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.service_type}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        Next →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 2: Plan Management</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-4">
          Who manages the participant's NDIS plan? *
        </label>
        <div className="space-y-3">
          {[
            { value: 'coordinator', label: 'Support Coordinator' },
            { value: 'planner', label: 'NDIS Planner' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="managed_by"
                value={option.value}
                checked={formData.managed_by === option.value}
                onChange={handleChange}
                className="mr-3"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!formData.managed_by}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 3: Coordinator Information</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Support Coordinator Name
        </label>
        <input
          type="text"
          name="support_coordinator_name"
          value={formData.support_coordinator_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="support_coordinator_phone"
            value={formData.support_coordinator_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="support_coordinator_email"
            value={formData.support_coordinator_email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(4)}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const showPlanner = formData.managed_by === 'planner';
    const showGroupHome = formData.service_type === 'sil_group_home' || formData.service_type === 'sil_and_cp';
    const showInHome = formData.service_type === 'in_home_support';
    const showDayProgram = formData.service_type === 'day_program';

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Step 4: Service Details</h2>

        {showPlanner && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4">NDIS Planner Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Planner Name *</label>
                <input
                  type="text"
                  name="planner_name"
                  value={formData.planner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="planner_phone"
                    value={formData.planner_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="planner_email"
                    value={formData.planner_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Organization</label>
                <input
                  type="text"
                  name="planner_organization"
                  value={formData.planner_organization}
                  onChange={handleChange}
                  placeholder="e.g., Local NDIS Coordination Point"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {showGroupHome && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-900 mb-4">Group Home Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Group Home Name</label>
                <input
                  type="text"
                  name="group_home_name"
                  value={formData.group_home_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Address *</label>
                <input
                  type="text"
                  name="group_home_address"
                  value={formData.group_home_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="group_home_phone"
                  value={formData.group_home_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {showInHome && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-900 mb-4">In-Home Support Details</h3>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Support Start Date *</label>
              <input
                type="date"
                name="in_home_support_start_date"
                value={formData.in_home_support_start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        )}

        {showDayProgram && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-4">Day Program Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Program Name</label>
                <input
                  type="text"
                  name="day_program_name"
                  value={formData.day_program_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Days Attended (e.g., Monday, Wednesday, Friday)
                </label>
                <input
                  type="text"
                  name="day_program_days"
                  value={formData.day_program_days}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
          <textarea
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStep(3)}
            className="flex-1 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : '✓ Complete Onboarding'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Participant Onboarding</h1>
          <p className="text-gray-600 mt-2">Step {step} of 4</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </main>
    </div>
  );
};
