import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { createPortal } from 'react-dom'


// Enhanced Arabic text normalization function
const normalizeArabicText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    // Remove all diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    // Normalize different forms of Alef
    .replace(/[أإآا]/g, 'ا')
    // Normalize different forms of Yaa
    .replace(/[يى]/g, 'ي')
    // Normalize different forms of Taa Marbouta and Haa
    .replace(/[ةه]/g, 'ه')
    // Normalize different forms of Waw
    .replace(/[ؤو]/g, 'و')
    // Remove extra spaces and trim
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

// Smart search function that uses normalized text
const smartSearch = (searchTerm, targetText) => {
  if (!searchTerm || !targetText) return false;
  
  const normalizedSearch = normalizeArabicText(searchTerm);
  const normalizedTarget = normalizeArabicText(targetText);
  
  // Also check the original text for non-Arabic searches
  const originalSearch = searchTerm.toLowerCase().trim();
  const originalTarget = targetText.toLowerCase().trim();
  
  return normalizedTarget.includes(normalizedSearch) || 
         originalTarget.includes(originalSearch);
};

const CityChooser = forwardRef(({ onChange, defaultCity = null, placeholder = "ادخل اسم المدينة", type = 0, locale = "ar" }, ref) => {
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const citiesApi = `/api/cities?locale=${locale}`

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    }
  }))

  function fetchCities() {
    fetch(citiesApi)
      .then(response => response.json())
      .then(data => {
        setCities(data || []) // Ensure data is an array
      })
      .catch(error => {
        console.error('Error fetching cities:', error)
        setCities([]) // Set to empty array on error
      })
  }

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px margin
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  // Effect for initializing/updating based on defaultCity prop and fetched cities
  useEffect(() => {
    // If defaultCity is null or undefined, clear current selection and input
    if (defaultCity == null) { // Using == null to catch both null and undefined
      if (selectedCity !== null || inputValue !== '') {
        setSelectedCity(null);
        setInputValue('');
      }
      return;
    }

    // Case 1: defaultCity is already a full city object
    if (typeof defaultCity === 'object' && defaultCity !== null && 'id' in defaultCity && 'name' in defaultCity && 'country' in defaultCity) {
      // Only update if it's different from the current selectedCity or inputValue needs sync
      if (selectedCity?.id !== defaultCity.id || inputValue !== `${defaultCity.name}, ${defaultCity.country}`) {
        setSelectedCity(defaultCity);
        setInputValue(`${defaultCity.name}, ${defaultCity.country}`);
      }
    }
    // Case 2: defaultCity is an ID (string or number) AND cities array is populated
    else if ((typeof defaultCity === 'string' || typeof defaultCity === 'number') && cities.length > 0) {
      const idToFind = String(defaultCity); // Normalize to string for robust comparison
      const cityFromList = cities.find(c => String(c.id) === idToFind);

      if (cityFromList) {
        // Only update if it's different or inputValue needs sync
        if (selectedCity?.id !== cityFromList.id || inputValue !== `${cityFromList.name}, ${cityFromList.country}`) {
          setSelectedCity(cityFromList);
          setInputValue(`${cityFromList.name}, ${cityFromList.country}`);
        }
      } else {
        // Default city ID not found in the fetched list
        console.warn(`Default city with ID "${defaultCity}" not found in fetched cities.`);
        // If a defaultCity ID was provided but not found, clear any prior state.
        if (selectedCity !== null || inputValue !== '') {
          setSelectedCity(null);
          setInputValue('');
        }
      }
    }
    // If defaultCity is an ID and cities are not yet loaded, this effect will re-run
    // when cities state updates, thanks to cities being in the dependency array.
  }, [defaultCity, cities]); // Dependencies: defaultCity prop and the fetched cities list

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCities([])
      setShowDropdown(false)
      return
    }

    // Do not filter if the current inputValue exactly matches the selected city's display text
    if (selectedCity && inputValue === `${selectedCity.name}, ${selectedCity.country}`) {
        setShowDropdown(false);
        setFilteredCities([]);
        return;
    }

    // Enhanced filtering with smart Arabic search
    const filtered = cities.filter(city => {
      const searchTerm = inputValue.trim();
      
      // Check city name with smart search
      const nameMatch = smartSearch(searchTerm, city.name || '');
      
      // Check country with smart search
      const countryMatch = smartSearch(searchTerm, city.country || '');
      
      return nameMatch || countryMatch;
    }).slice(0, 10)

    setFilteredCities(filtered)
    if (filtered.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    setHighlightedIndex(-1)
  }, [inputValue, cities, selectedCity])

  // Update position on window resize/scroll
  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (showDropdown) {
        updateDropdownPosition()
      }
    }

    window.addEventListener('resize', handleResizeOrScroll)
    window.addEventListener('scroll', handleResizeOrScroll, true) // Listen in capture phase for scroll

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    }
  }, [showDropdown])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    // If user types, it means they are changing the selection, so clear selectedCity
    if (selectedCity) {
      setSelectedCity(null);
    }
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setInputValue(`${city.name}, ${city.country}`)
    setShowDropdown(false)
    setHighlightedIndex(-1)
    if (onChange) {
      onChange(city)
    }
    inputRef.current?.focus();
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredCities.length === 0) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (inputValue.trim() !== '' && filteredCities.length > 0) {
                updateDropdownPosition();
                setShowDropdown(true);
            }
        }
        if(!showDropdown) return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
           prev > 0 ? prev - 1 : filteredCities.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
          handleCitySelect(filteredCities[highlightedIndex])
        } else if (filteredCities.length > 0 && highlightedIndex === -1) {
          handleCitySelect(filteredCities[0]);
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        break
      case 'Tab':
        if (showDropdown && highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
            e.preventDefault();
            handleCitySelect(filteredCities[highlightedIndex]);
        } else {
            setShowDropdown(false);
            setHighlightedIndex(-1);
        }
        break;
    }
  }

  const handleInputFocus = () => {
    if (inputValue.trim() !== '' && filteredCities.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(document.activeElement) &&
        inputRef.current && !inputRef.current.contains(document.activeElement)
      ) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }, 150)
  }

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const dropdownContent = showDropdown && (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 99999
      }}
      className="bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto"
      onMouseDown={(e) => e.preventDefault()}
    >
      {filteredCities.length > 0 ? (
        filteredCities.map((city, index) => (
          <div
            key={city.id}
            onClick={() => handleCitySelect(city)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
              index === highlightedIndex
                ? 'bg-blue-100 text-blue-900'
                : 'hover:bg-gray-100'
            } ${index === 0 ? 'rounded-t-lg' : ''} ${
              index === filteredCities.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
            }`}
          >
            <div className="font-medium text-gray-900">{city.name}</div>
            <div className="text-sm text-gray-500">{city.country}</div>
          </div>
        ))
      ) : (
        <div className="px-4 py-3 text-gray-500 text-center">
          {inputValue.trim() === '' ? 'ابدأ بالكتابة للبحث' : 'لا توجد مدن'}
        </div>
      )}
    </div>
  )

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full focus:outline-none focus:border-transparent"
        />
        {selectedCity && (
          <div className={`absolute ${locale == "en" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {typeof window !== 'undefined' && dropdownContent && createPortal(
        dropdownContent,
        document.body
      )}
    </div>
  )
})

export default CityChooser