'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkListEditor from './LinkListEditor';

export interface EditableJob {
  title: string;
  description: string;
  category: string;
  budget: number | string;
  deadline: string;
  references?: string[];
  resources?: string[];
}

export default function EditJobForm({ jobId, initialJob }: { jobId: string; initialJob: EditableJob }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: initialJob.title,
    description: initialJob.description,
    category: initialJob.category,
    budget: String(initialJob.budget),
    deadline: initialJob.deadline?.split('T')[0] || '',
    references: initialJob.references || [],
    resources: initialJob.resources || [],
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
    // Fix: Use proper if-else instead of unused ternary expression
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
      const res = await fetch(`/api/job/edit/${jobId}`, { // ✅ This matches /api/job/edit/[jobId]
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: parseFloat(form.budget),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Single Page Container */}
        <div className="bg-white rounded-xl shadow-lg border border-cyan-200">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-t-xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Job Posting</h1>
              <p className="text-cyan-100">Update your job details and requirements</p>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-700 mb-6 pb-3 border-b border-cyan-200">
                    Basic Information
                  </h2>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    id="title" name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    placeholder="Enter job title"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    id="category" name="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    placeholder="Job category"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        id="budget" name="budget"
                        type="number"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      id="deadline" name="deadline"
                      type="date"

                      aria-label="Deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Describe your job requirements..."
                  />
                </div>
              </div>

              {/* References and Resources Section */}
              <div className="space-y-8">
                {/* References */}
                <LinkListEditor
                  title="Reference Links"
                  inputLabel="Reference link"
                  removeLabel="Remove reference"
                  emptyText="No references added yet"
                  items={form.references}
                  inputValue={referenceInput}
                  onInputChange={setReferenceInput}
                  onAdd={() => handleAddLink('references', referenceInput)}
                  onRemove={(index) => handleRemoveLink('references', index)}
                  addButtonClass="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  itemClass="bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 hover:from-cyan-100 hover:to-teal-100"
                />

                {/* Resources */}
                <LinkListEditor
                  title="Resource Links"
                  inputLabel="Resource link"
                  removeLabel="Remove resource"
                  emptyText="No resources added yet"
                  items={form.resources}
                  inputValue={resourceInput}
                  onInputChange={setResourceInput}
                  onAdd={() => handleAddLink('resources', resourceInput)}
                  onRemove={(index) => handleRemoveLink('resources', index)}
                  addButtonClass="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  itemClass="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-cyan-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/client')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Job'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
