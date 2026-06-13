import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const GenerateAgreementPage = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    template_id: '',
    start_date: '',
    end_date: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateDocument = async (format: 'docx' | 'pdf') => {
    setError('');
    setLoading(true);

    try {
      // First create the agreement if not exists
      const agreementResponse = await api.post('/agreements', {
        participant_id: participantId,
        ...formData,
      });

      const agreementId = agreementResponse.data.data.id;

      // Generate document
      const response = await api.post(
        `/documents/${agreementId}/generate`,
        { format },
        {
          responseType: 'blob',
        } as any
      );

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `agreement-${participantId}.${format === 'pdf' ? 'pdf' : 'docx'}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to generate ${format}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Generate Service Agreement</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Agreement Template *
              </label>
              <select
                name="template_id"
                value={formData.template_id}
                onChange={handleChange as any}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a template</option>
                <option value="sil-template">SIL Service Agreement</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">Generate Document</h3>
              <p className="text-blue-800 text-sm mb-4">
                Your agreement will be generated with participant details automatically populated.
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleGenerateDocument('docx')}
                  disabled={loading || !formData.template_id || !formData.start_date}
                  className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  {loading ? 'Generating...' : '📄 Download as Word (.docx)'}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateDocument('pdf')}
                  disabled={loading || !formData.template_id || !formData.start_date}
                  className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                >
                  {loading ? 'Generating...' : '📕 Download as PDF'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
