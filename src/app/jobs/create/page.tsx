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
    <main className="min-h-screen bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center px-4">
        <div className="w-full max-w-lg my-6 bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Create a New Job</h1>

            {message && (
                <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded text-center text-sm">
                    {message}
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Title <span className="text-red-500">*</span></label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="Job Title"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="Job Description"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Category <span className="text-red-500">*</span></label>
                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="e.g. Web Design"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1 text-gray-700">Budget (USD) <span className="text-red-500">*</span></label>
                        <input
                            name="budget"
                            type="number"
                            value={form.budget}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            placeholder="1000"
                            min={0}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1 text-gray-700">Deadline <span className="text-red-500">*</span></label>
                        <input
                            name="deadline"
                            type="date"
                            value={form.deadline}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                </div>

                {/* References */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Reference Links <span className="text-gray-400">(Optional)</span></label>
                    <div className="flex gap-2 mb-2">
                        <input
                            value={referenceInput}
                            onChange={e => setReferenceInput(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddLink('references', referenceInput)}
                            className="bg-linear-to-r from-cyan-500 to-blue-500 px-3 pr-5 flex items-center justify-center  rounded-full text-white font-bold shadow-lg hover:from-white hover:to-white hover:text-cyan-500 transition-colors duration-300"
                        >
                            +Add
                        </button>
                    </div>
                    <div className="space-y-1">
                        {form.references.map((ref, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                                <span className="text-sm break-all">{ref}</span>
                                <button
                                    onClick={() => handleRemoveLink('references', idx)}
                                    className="ml-2 text-xs text-red-500 hover:underline"
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resources */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Resource Links <span className="text-gray-400">(Optional)</span></label>
                    <div className="flex gap-2 mb-2">
                        <input
                            value={resourceInput}
                            onChange={e => setResourceInput(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddLink('resources', resourceInput)}
                            className="bg-linear-to-r from-cyan-500 to-blue-500 px-3 pr-5 flex items-center justify-center  rounded-full text-white font-bold shadow-lg hover:from-white hover:to-white hover:text-cyan-500 transition-colors duration-300"
                        >
                            +Add
                        </button>
                    </div>
                    <div className="space-y-1">
                        {form.resources.map((res, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                                <span className="text-sm break-all">{res}</span>
                                <button
                                    onClick={() => handleRemoveLink('resources', idx)}
                                    className="ml-2 text-xs text-red-500 hover:underline"
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-4 bg-linear-to-bl from-lime-500 to-emerald-400 bg- hover:to-lime-200 hover:from-lime-200 text-white hover:text-green-600 font-semibold py-3 px-6 rounded-lg shadow transition disabled:opacity-60"
                >
                    {loading ? 'Creating...' : 'Post Job'}
                </button>
            </div>
        </div>
    </main>
);
}
