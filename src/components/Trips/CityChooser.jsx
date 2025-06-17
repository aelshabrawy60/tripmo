import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { createPortal } from 'react-dom'

const citiesApi = '/api/cities'

const CityChooser = forwardRef(({ onChange, defaultCity = null, placeholder = "ادخل اسم المدينة", type = 0 }, ref) => {
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

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
    // when `cities` state updates, thanks to `cities` being in the dependency array.
  }, [defaultCity, cities]); // Dependencies: defaultCity prop and the fetched cities list

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCities([])
      setShowDropdown(false)
      // If user clears input, and there was a selectedCity, we might want to call onChange(null)
      // For now, selectedCity is cleared by handleInputChange, onChange is only on explicit selection.
      return
    }

    // Do not filter if the current inputValue exactly matches the selected city's display text
    // This prevents the dropdown from showing up again if a city is selected and input hasn't changed.
    if (selectedCity && inputValue === `${selectedCity.name}, ${selectedCity.country}`) {
        setShowDropdown(false);
        setFilteredCities([]); // Clear filtered cities as well
        return;
    }


    const filtered = cities.filter(city =>
      (city.name && city.name.toLowerCase().includes(inputValue.toLowerCase())) ||
      (city.country && city.country.toLowerCase().includes(inputValue.toLowerCase()))
    ).slice(0, 10)

    setFilteredCities(filtered)
    if (filtered.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    setHighlightedIndex(-1)
  }, [inputValue, cities, selectedCity]) // Added selectedCity to re-evaluate when it changes

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
  }, [showDropdown]) // Re-add/remove listeners when showDropdown changes

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    // If user types, it means they are changing the selection, so clear selectedCity
    // This allows the filtering logic to kick in based on the new input value.
    if (selectedCity) {
      setSelectedCity(null);
      // Optionally, notify parent that selection is cleared due to typing
      // if (onChange) onChange(null); // Decide if this is desired behavior
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
    inputRef.current?.focus(); // Keep focus on input after selection
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredCities.length === 0) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
             // If dropdown is not shown but user presses arrow keys, try to open it if there's input
            if (inputValue.trim() !== '' && filteredCities.length > 0) {
                updateDropdownPosition();
                setShowDropdown(true);
            }
        }
        if(!showDropdown) return; // if still not shown, exit
    }


    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : 0 // Loop to top
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
           prev > 0 ? prev - 1 : filteredCities.length - 1 // Loop to bottom
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
          handleCitySelect(filteredCities[highlightedIndex])
        } else if (filteredCities.length > 0 && highlightedIndex === -1) {
          // If user presses Enter without explicitly highlighting, select the first item
          // This is a common UX pattern.
          handleCitySelect(filteredCities[0]);
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        // inputRef.current?.blur() // Optional: blur on escape
        break
      case 'Tab':
        // If tabbing out and an item is highlighted, select it.
        // Otherwise, allow default tab behavior (blur).
        if (showDropdown && highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
            e.preventDefault(); // Prevent tabbing away
            handleCitySelect(filteredCities[highlightedIndex]);
        } else {
            setShowDropdown(false); // Hide dropdown on tab out
            setHighlightedIndex(-1);
        }
        break;
    }
  }

  const handleInputFocus = () => {
    // Show dropdown if there's text and filtered results, or if input is empty but we want to show recent/all
    // For now, only show if there are filtered results based on current input
    if (inputValue.trim() !== '' && filteredCities.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    } else if (inputValue.trim() === '' && cities.length > 0) {
        // Optionally, show all cities or a subset if input is empty on focus
        // setFilteredCities(cities.slice(0,10)); // Example: show first 10
        // setShowDropdown(true);
        // updateDropdownPosition();
    }
  }

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow click on dropdown items
    setTimeout(() => {
      // Check if the new active element is within the dropdown or the input itself
      if (
        dropdownRef.current && !dropdownRef.current.contains(document.activeElement) &&
        inputRef.current && !inputRef.current.contains(document.activeElement)
      ) {
        // If a city is selected, ensure input value matches
        if (selectedCity) {
            const expectedInputValue = `${selectedCity.name}, ${selectedCity.country}`;
            if (inputValue !== expectedInputValue) {
                // User might have typed something that doesn't match a city
                // and then blurred. Reset to last valid selection or clear.
                // For now, let's revert to selected city if one exists.
                // Or, if no city is selected and input is "invalid", clear it.
                // This part needs careful UX consideration.
                // For simplicity, if blurred and no valid selection, just hide.
                // setInputValue(expectedInputValue);
            }
        } else if (inputValue.trim() !== '' && filteredCities.length === 0) {
            // If user typed something that results in no matches and blurs, clear input
            // setInputValue(''); // This might be too aggressive
        }
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }, 150) // Adjust delay as needed
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
      onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking on dropdown
    >
      {filteredCities.length > 0 ? (
        filteredCities.map((city, index) => (
          <div
            key={city.id}
            onClick={() => handleCitySelect(city)}
            onMouseEnter={() => setHighlightedIndex(index)} // Highlight on mouse enter
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
          {inputValue.trim() === '' ? 'ابدأ بالكتابة للبحث' : 'No cities found'}
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
          className="w-full focus:outline-none focus:border-transparent" // Added some padding and border for visibility
        />
        {selectedCity && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"> {/* pointer-events-none for icon */}
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