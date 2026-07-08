import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ value, onChange, options, placeholder, fontClass = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-theme-input ${isOpen ? 'shadow-xl' : ''} rounded-xl px-4 py-3 text-xs text-theme-primary focus:outline-none transition-all appearance-none ${fontClass}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-theme-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-theme-accent-yellow' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-theme-card border border-theme-border backdrop-blur-2xl rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs flex items-center justify-between transition-colors ${fontClass} ${
                  isSelected 
                    ? 'font-bold' 
                    : 'text-theme-secondary hover:bg-theme-card-hover hover:text-theme-primary'
                }`}
                style={isSelected ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-text)' } : undefined}
              >
                <span className="truncate pr-2">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
