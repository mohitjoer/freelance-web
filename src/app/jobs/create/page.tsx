'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CreateJobPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    references: [] as string[],
    resources: [] as string[],
  });

  const [referenceInput, setReferenceInput] = useState('');
  const [resourceInput, setResourceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLink = (type: 'references' | 'resources', value: string) => {
    if (!value.trim()) return;
    setForm(prev => ({ ...prev, [type]: [...prev[type], value.trim()] }));
    if (type === 'references') setReferenceInput('');
    if (type === 'resources') setResourceInput('');
  };

  const handleRemoveLink = (type: 'references' | 'resources', index: number) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    if (!form.title || !form.description || !form.category || !form.budget || !form.deadline) {
      setMessage('Please fill all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/job/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: parseFloat(form.budget),
        }),
      });

      const result = await res.json();

      if (result.success) {
        router.push('/dashboard/client'); // or jobs/list if needed
      } else {
        setMessage(result.message || 'Failed to create job.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) return <div className="p-8 text-center">Loading...</div>;

return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200 p-8 backdrop-blur-sm">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">Create New Job Posting</h1>
                    <p className="text-cyan-700">Fill out the form below to post a new job opportunity</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg shadow-sm">
                        <div className="flex">
                            <div className="text-red-800 text-sm">{message}</div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-cyan-700 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                placeholder="Enter job title"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-cyan-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                placeholder="e.g. Web Development, Design, Marketing"
                            />
                        </div>

                        {/* Budget and Deadline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-cyan-700 mb-2">
                                    Budget (USD) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="budget"
                                    type="number"
                                    value={form.budget}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                    placeholder="1000"
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-700 mb-2">
                                    Deadline <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="deadline"
                                    type="date"
                                    value={form.deadline}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Job Description */}
                        <div>
                            <label className="block text-sm font-medium text-cyan-700 mb-2">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                placeholder="Describe the job requirements, expectations, and deliverables..."
                            />
                        </div>
                    </div>
                </div>

                {/* References Section */}
                <div className="mt-8 pt-6 border-t border-cyan-200">
                    <h3 className="text-lg font-medium text-cyan-800 mb-4">Additional Information</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Reference Links */}
                        <div>
                            <label className="block text-sm font-medium text-cyan-700 mb-2">
                                Reference Links <span className="text-teal-600">(Optional)</span>
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={referenceInput}
                                    onChange={e => setReferenceInput(e.target.value)}
                                    placeholder="https://example.com"
                                    className="flex-1 px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddLink('references', referenceInput)}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium rounded-md hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {form.references.map((ref, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-cyan-50 p-2 rounded-md border border-cyan-200">
                                        <span className="text-sm text-cyan-800 break-all mr-2">{ref}</span>
                                        <button
                                            onClick={() => handleRemoveLink('references', idx)}
                                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resource Links */}
                        <div>
                            <label className="block text-sm font-medium text-cyan-700 mb-2">
                                Resource Links <span className="text-teal-600">(Optional)</span>
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={resourceInput}
                                    onChange={e => setResourceInput(e.target.value)}
                                    placeholder="https://example.com"
                                    className="flex-1 px-3 py-2 border border-cyan-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-cyan-50/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddLink('resources', resourceInput)}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium rounded-md hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {form.resources.map((res, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-cyan-50 p-2 rounded-md border border-cyan-200">
                                        <span className="text-sm text-cyan-800 break-all mr-2">{res}</span>
                                        <button
                                            onClick={() => handleRemoveLink('resources', idx)}
                                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-cyan-200">
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-[1.02]"
                        >
                            {loading ? 'Creating Job...' : 'Post Job'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
);
}