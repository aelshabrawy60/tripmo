import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'

const citiesApi = '/api/cities'

const CityChooser = forwardRef(({ onChange, defaultCity = null, placeholder = "ادخل اسم المدينة", type = 0 }, ref) => {
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
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
    setShowDropdown(filtered.length > 0)
    setHighlightedIndex(-1)
  }, [inputValue, cities])

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
          className="w-full rounded-lg focus:outline-none  focus:border-transparent"
        />
        {selectedCity && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
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
      )}
    </div>
  )
})

export default CityChooser
