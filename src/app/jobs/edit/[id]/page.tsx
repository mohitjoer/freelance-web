'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job/edit/${jobId}`);
        const data = await res.json();
        if (data.success) {
          const job = data.data;
          setForm({
            title: job.title,
            description: job.description,
            category: job.category,
            budget: job.budget.toString(),
            deadline: job.deadline.split('T')[0],
            references: job.references || [],
            resources: job.resources || [],
          });
        } else {
          setMessage(data.message || 'Failed to load job.');
        }
      } catch {
        setMessage('Server error.');
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLink = (type: 'references' | 'resources', value: string) => {
    if (!value.trim()) return;
    setForm(prev => ({ ...prev, [type]: [...prev[type], value.trim()] }));
    if (type === 'references') {
      setReferenceInput('');
    } else {
      setResourceInput('');
    }
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

    try {
      const res = await fetch(`/api/job/edit/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: parseFloat(form.budget),
        }),
      });

      const result = await res.json();
      if (result.success) {
        router.push('/dashboard/client');
      } else {
        setMessage(result.message || 'Failed to update job.');
      }
    } catch {
      setMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="w-full max-w-lg my-6 bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Edit Job</h1>

        {message && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded text-center text-sm">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Job Title"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Job Description"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="e.g. Web Design"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Budget (USD)</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="1000"
              min={0}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Deadline</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* References */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Reference Links</label>
            <div className="flex gap-2 mb-2">
              <input
                value={referenceInput}
                onChange={e => setReferenceInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-gray-300 p-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleAddLink('references', referenceInput)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
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
            <label className="block font-semibold mb-1 text-gray-700">Resource Links</label>
            <div className="flex gap-2 mb-2">
              <input
                value={resourceInput}
                onChange={e => setResourceInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-gray-300 p-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleAddLink('resources', resourceInput)}
                className="bg-green-500 text-white px-3 py-1 rounded"
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
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-bl from-lime-500 to-emerald-400 hover:from-lime-200 hover:to-lime-200 text-white hover:text-green-600 font-semibold py-3 px-6 rounded-lg shadow transition disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Update Job'}
        </button>
      </div>
    </main>
  );
}