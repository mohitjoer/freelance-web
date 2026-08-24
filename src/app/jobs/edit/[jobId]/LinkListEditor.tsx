'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

interface LinkListEditorProps {
  title: string;
  inputLabel: string;
  removeLabel: string;
  emptyText: string;
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  addButtonClass: string;
  itemClass: string;
}

export default function LinkListEditor({
  title,
  inputLabel,
  removeLabel,
  emptyText,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  addButtonClass,
  itemClass,
}: LinkListEditorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-700 mb-6 pb-3 border-b border-teal-200">
        {title}
      </h2>
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            aria-label={inputLabel}
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
          <button
            type="button"
            onClick={onAdd}
            className={`px-6 py-3 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition font-medium shadow-md ${addButtonClass}`}
          >
            Add
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item}
              className={`flex items-center justify-between p-3 rounded-lg border transition ${itemClass}`}
            >
              <span className="text-sm text-gray-700 break-all mr-3">{item}</span>
              <button
                type="button" aria-label={removeLabel}

                onClick={() => onRemove(index)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              >
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-sm italic text-center py-4">{emptyText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
