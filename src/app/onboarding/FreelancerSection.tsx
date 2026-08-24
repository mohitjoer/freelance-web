'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

interface PortfolioItem {
  title: string;
  link: string;
}

interface FreelancerSectionProps {
  skills: string;
  onSkillsChange: (value: string) => void;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  onExperienceLevelChange: (value: 'beginner' | 'intermediate' | 'expert') => void;
  portfolio: PortfolioItem[];
  portfolioTitle: string;
  onPortfolioTitleChange: (value: string) => void;
  portfolioLink: string;
  onPortfolioLinkChange: (value: string) => void;
  onAddPortfolio: () => void;
  onRemovePortfolio: (item: PortfolioItem) => void;
}

export default function FreelancerSection({
  skills,
  onSkillsChange,
  experienceLevel,
  onExperienceLevelChange,
  portfolio,
  portfolioTitle,
  onPortfolioTitleChange,
  portfolioLink,
  onPortfolioLinkChange,
  onAddPortfolio,
  onRemovePortfolio,
}: FreelancerSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="skills" className="block text-xs font-semibold text-gray-700">Skills</label>
        <input
          id="skills"
          aria-label="Skills"
          value={skills}
          onChange={(e) => onSkillsChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder="e.g. Video editing, Web development, React"
          required
        />
        <p className="text-xs text-gray-500">Separate skills with commas</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="experienceLevel" className="block text-xs font-semibold text-gray-700">Experience Level</label>
        <select
          aria-label="Experience level"
          id="experienceLevel"
          value={experienceLevel}
          onChange={e => onExperienceLevelChange(e.target.value as 'beginner' | 'intermediate' | 'expert')}
          className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          required
        >
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (2-5 years)</option>
          <option value="expert">Expert (5+ years)</option>
        </select>
      </div>

      {/* Portfolio Section */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-gray-700">Portfolio Links</span>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={portfolioTitle}
              onChange={(e) => onPortfolioTitleChange(e.target.value)}
              aria-label="Project title"
              placeholder="Project title"
              className="px-2 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => onPortfolioLinkChange(e.target.value)}
              aria-label="Project link"
              placeholder="https://yourproject.com"
              className="px-2 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={onAddPortfolio}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 font-medium text-sm"
          >
            Add Portfolio Item
          </button>
        </div>

        {portfolio.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            <h4 className="text-xs font-medium text-gray-700">Your Portfolio:</h4>
            <div className="space-y-1">
              {portfolio.map((item) => (
                <div key={`${item.title}-${item.link}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.link}</p>
                  </div>
                  <button
                    onClick={() => onRemovePortfolio(item)}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Remove portfolio item"
                  >
                    <DeleteOutlineIcon style={{ fontSize: '16px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
