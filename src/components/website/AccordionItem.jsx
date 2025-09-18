
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ 
  title, 
  children, 
  defaultOpen = false,
  variant = 'minimal',
  disabled = false,
  icon = null,
  className = '',
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: {
      container: 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/30',
      containerOpen: 'bg-white border-blue-200 shadow-lg shadow-blue-100/50',
      title: 'text-slate-800 group-hover:text-blue-800',
      titleOpen: 'text-blue-900',
      gradient: 'from-blue-50/50 via-indigo-50/30 to-purple-50/50'
    },
    minimal: {
      container: 'bg-transparent border-slate-200 hover:border-slate-300',
      containerOpen: '',
      title: 'text-slate-900 group-hover:text-slate-700',
      titleOpen: 'text-slate-900',
      gradient: 'from-slate-50/30 to-slate-100/30'
    },
    card: {
      container: 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300',
      containerOpen: 'bg-gradient-to-br from-white to-indigo-50/30 border-indigo-300 shadow-xl',
      title: 'text-slate-800 group-hover:text-indigo-800',
      titleOpen: 'text-indigo-900',
      gradient: 'from-indigo-50/40 via-purple-50/20 to-pink-50/30'
    }
  };

  const currentVariant = variants[variant];

  const handleToggle = () => {
    if (disabled) return;
    
    setIsOpen(prev => {
      const newState = !prev;
      onToggle?.(newState);
      return newState;
    });
  };

  return (
    <div
      className={`
        group relative overflow-hidden rounded-md transition-all duration-300 ease-out
        ${isOpen ? currentVariant.containerOpen : currentVariant.container}
        ${isHovered && !isOpen ? 'transform scale-[1]' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-r ${currentVariant.gradient}
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `} />

      <button
        onClick={handleToggle}
        disabled={disabled}
        className="relative w-full py-4 text-left focus:outline-none focus:ring-offset-2  transition-all duration-200 disabled:cursor-not-allowed"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={`
                flex-shrink-0 transition-colors duration-200
                ${isOpen ? currentVariant.titleOpen : currentVariant.title}
              `}>
                {icon}
              </div>
            )}
            <h3 className={`
              text-lg font-semibold transition-colors duration-200 pr-4
              ${isOpen ? currentVariant.titleOpen : currentVariant.title}
            `}>
              {title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Chevron indicator */}
            <div className={`
              p-1 rounded-full transition-all duration-300 ease-out
              ${ 
                'text-slate-600'
              }
              ${disabled ? 'opacity-50' : ''}
            `}>
              <ChevronDown 
                size={16} 
                className={`
                  transition-transform duration-300 ease-out
                  ${isOpen ? 'rotate-180' : 'group-hover:rotate-12'}
                `} 
              />
            </div>
          </div>
        </div>
      </button>

      {/* Content with smooth animation */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="relative pb-4">          
          <div className={`
            text-slate-700 leading-relaxed transition-all duration-500 ease-out
            ${isOpen ? 'transform translate-y-0' : 'transform -translate-y-2'}
          `}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccordionItem