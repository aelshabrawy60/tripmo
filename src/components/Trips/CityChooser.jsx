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
        setCities(data)
      })
      .catch(error => {
        console.error('Error fetching cities:', error)
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

  useEffect(() => {
    if (defaultCity) {
      setSelectedCity(defaultCity)
      setInputValue(`${defaultCity.name}, ${defaultCity.country}`)
    }
  }, [defaultCity])

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCities([])
      setShowDropdown(false)
      return
    }

    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      city.country.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 10)

    setFilteredCities(filtered)
    if (filtered.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    setHighlightedIndex(-1)
  }, [inputValue, cities])

  // Update position on window resize/scroll
  useEffect(() => {
    const handleResize = () => {
      if (showDropdown) {
        updateDropdownPosition()
      }
    }

    const handleScroll = () => {
      if (showDropdown) {
        updateDropdownPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showDropdown])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setSelectedCity(null)
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setInputValue(`${city.name}, ${city.country}`)
    setShowDropdown(false)
    setHighlightedIndex(-1)
    if (onChange) {
      onChange(city)
    }
  }

  const handleKeyDown = (e) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
          handleCitySelect(filteredCities[highlightedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleInputFocus = () => {
    if (filteredCities.length > 0) {
      updateDropdownPosition()
      setShowDropdown(true)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }, 200)
  }

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
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
    >
      {filteredCities.length > 0 ? (
        filteredCities.map((city, index) => (
          <div
            key={city.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleCitySelect(city)}
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
          No cities found
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
          className="w-full rounded-lg focus:outline-none focus:border-transparent"
        />
        {selectedCity && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Render dropdown using portal to document.body */}
      {typeof window !== 'undefined' && dropdownContent && createPortal(
        dropdownContent,
        document.body
      )}
    </div>
  )
})

export default CityChooser