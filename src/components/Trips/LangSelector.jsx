
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';

// Comprehensive list of languages with their codes
export const languages = [
  { code: 'ar', name: 'العربية', englishName: 'Arabic' },
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'fr', name: 'Français', englishName: 'French' },
  { code: 'es', name: 'Español', englishName: 'Spanish' },
  { code: 'de', name: 'Deutsch', englishName: 'German' },
  { code: 'it', name: 'Italiano', englishName: 'Italian' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese' },
  { code: 'ru', name: 'Русский', englishName: 'Russian' },
  { code: 'ja', name: '日本語', englishName: 'Japanese' },
  { code: 'ko', name: '한국어', englishName: 'Korean' },
  { code: 'zh', name: '中文', englishName: 'Chinese' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish' },
  { code: 'da', name: 'Dansk', englishName: 'Danish' },
  { code: 'no', name: 'Norsk', englishName: 'Norwegian' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish' },
  { code: 'pl', name: 'Polski', englishName: 'Polish' },
  { code: 'cs', name: 'Čeština', englishName: 'Czech' },
  { code: 'sk', name: 'Slovenčina', englishName: 'Slovak' },
  { code: 'hu', name: 'Magyar', englishName: 'Hungarian' },
  { code: 'ro', name: 'Română', englishName: 'Romanian' },
  { code: 'bg', name: 'Български', englishName: 'Bulgarian' },
  { code: 'hr', name: 'Hrvatski', englishName: 'Croatian' },
  { code: 'sr', name: 'Српски', englishName: 'Serbian' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew' },
  { code: 'fa', name: 'فارسی', englishName: 'Persian' },
  { code: 'ur', name: 'اردو', englishName: 'Urdu' },
  { code: 'th', name: 'ไทย', englishName: 'Thai' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay' },
  { code: 'tl', name: 'Filipino', englishName: 'Filipino' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili' },
  { code: 'am', name: 'አማርኛ', englishName: 'Amharic' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu' },
  { code: 'si', name: 'සිංහල', englishName: 'Sinhala' },
  { code: 'my', name: 'မြန်မာ', englishName: 'Burmese' },
  { code: 'km', name: 'ខ្មែរ', englishName: 'Khmer' },
  { code: 'lo', name: 'ລາວ', englishName: 'Lao' },
  { code: 'ka', name: 'ქართული', englishName: 'Georgian' },
  { code: 'hy', name: 'Հայերեն', englishName: 'Armenian' },
  { code: 'az', name: 'Azərbaycan', englishName: 'Azerbaijani' },
  { code: 'kk', name: 'Қазақша', englishName: 'Kazakh' },
  { code: 'ky', name: 'Кыргызча', englishName: 'Kyrgyz' },
  { code: 'uz', name: 'O\'zbek', englishName: 'Uzbek' },
  { code: 'mn', name: 'Монгол', englishName: 'Mongolian' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali' },
  { code: 'bo', name: 'བོད་ཡིག', englishName: 'Tibetan' }
];

function LangSelector({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, openUpward: false, openLeftward: false });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Dropdown dimensions (approximate)
    const dropdownWidth = 320; // 20rem = 320px
    const dropdownHeight = 400; // max-height of dropdown content
    
    // Calculate if dropdown should open upward
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    // Calculate if dropdown should open leftward
    const spaceRight = viewportWidth - buttonRect.left;
    const spaceLeft = buttonRect.right;
    const openLeftward = spaceRight < dropdownWidth && spaceLeft > spaceRight;
    
    // Calculate position
    let top, left;
    
    if (openUpward) {
      top = buttonRect.top - dropdownHeight - 8; // 8px gap
      // Ensure it doesn't go above viewport
      top = Math.max(8, top);
    } else {
      top = buttonRect.bottom + 8; // 8px gap
      // Ensure it doesn't go below viewport
      top = Math.min(viewportHeight - dropdownHeight - 8, top);
    }
    
    if (openLeftward) {
      left = buttonRect.right - dropdownWidth;
      // Ensure it doesn't go beyond left edge
      left = Math.max(8, left);
    } else {
      left = buttonRect.left;
      // Ensure it doesn't go beyond right edge
      left = Math.min(viewportWidth - dropdownWidth - 8, left);
    }

    setDropdownPosition({ top, left, openUpward, openLeftward });
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      
      // Recalculate on window resize or scroll
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  const handleSelect = (langCode) => {
    onSelect(langCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        type='button'
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <span>اضافة لغة</span>
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={handleClose}
          />
          
          {/* Dropdown Content */}
          <div 
            ref={dropdownRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-80 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              maxHeight: `${Math.min(400, window.innerHeight - dropdownPosition.top - 16)}px`
            }}
          >
            {/* Header with Search */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث عن اللغة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                </div>
                <button
                  type='button'
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto" style={{ maxHeight: `${Math.min(320, window.innerHeight - dropdownPosition.top - 96)}px` }}>
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    type='button'
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className="w-full px-4 py-3 text-right hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-mono">
                        {lang.code}
                      </span>
                      <div className="text-right">
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-sm text-gray-500">{lang.englishName}</div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>لم يتم العثور على أي لغة</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default LangSelector;