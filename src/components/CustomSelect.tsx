import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
  number?: number;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder,
  searchable = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable 
    ? options.filter(opt => 
        opt.label.includes(searchTerm) || 
        opt.sublabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.number?.toString().includes(searchTerm)
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          {selectedOption && selectedOption.icon && (
            <span className="text-lg">{selectedOption.icon}</span>
          )}
          <span className="text-[#F1F0FF]">
            {selectedOption ? (
              <span>
                {selectedOption.label}
                {selectedOption.number && (
                  <span className="text-[#9B99B8] mr-2">({selectedOption.number})</span>
                )}
              </span>
            ) : (
              placeholder
            )}
          </span>
        </div>
        <ChevronDown
          size={18}
          style={{
            color: '#8B5CF6',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
            style={{
              background: '#1A1A26',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-purple-500/20">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن ولايتك..."
                    className="w-full px-4 py-2 pr-10 bg-[rgba(10, 10, 15, 0.6)] border-b border-purple-500/15 text-[#F1F0FF] font-['Cairo'] text-sm focus:outline-none placeholder:text-[#9B99B8]"
                    style={{
                      fontFamily: "'Cairo', sans-serif"
                    }}
                  />
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B99B8]" />
                </div>
              </div>
            )}

            {/* Options List */}
            <div 
              className="max-h-60 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(139,92,246,0.4) transparent'
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-[#9B99B8] text-sm font-['Cairo']">
                  لا توجد نتائج
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full px-5 py-3 font-['Cairo'] text-sm flex items-center gap-3 transition-all duration-150"
                    style={{
                      color: value === option.value ? '#A78BFA' : '#C4B5FD',
                      background: value === option.value ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                      fontWeight: value === option.value ? '600' : '400'
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                        e.currentTarget.style.color = '#F1F0FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#C4B5FD';
                      }
                    }}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                    {option.sublabel && (
                      <span className="text-[#9B99B8] text-xs mr-auto">{option.sublabel}</span>
                    )}
                    {option.number && (
                      <span className="text-[#9B99B8] text-xs mr-auto">({option.number})</span>
                    )}
                    {value === option.value && (
                      <Check size={16} className="mr-auto text-[#A78BFA]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
