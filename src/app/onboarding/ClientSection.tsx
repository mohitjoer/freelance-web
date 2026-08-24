'use client';

interface ClientSectionProps {
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  companyWebsite: string;
  onCompanyWebsiteChange: (value: string) => void;
}

export default function ClientSection({
  companyName,
  onCompanyNameChange,
  companyWebsite,
  onCompanyWebsiteChange,
}: ClientSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="companyName" className="block text-xs font-semibold text-gray-700">Company Name</label>
        <input
          id="companyName"
          aria-label="Company name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder="e.g. Acme Inc."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="companyWebsite" className="block text-xs font-semibold text-gray-700">Company Website</label>
        <input
          id="companyWebsite"
          aria-label="Company website"
          value={companyWebsite}
          onChange={(e) => onCompanyWebsiteChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );
}
