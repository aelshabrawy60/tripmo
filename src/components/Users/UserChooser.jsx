import { useEffect, useState } from "react"


const UserChooser = ({ groupId, onChange }) => {
    // Country codes data - focused on Middle Eastern countries
    const countryCodes = [
        { code: "+966", flag: "🇸🇦", name: "السعودية" },
        { code: "+971", flag: "🇦🇪", name: "الإمارات" },
        { code: "+20", flag: "🇪🇬", name: "مصر" },
        { code: "+962", flag: "🇯🇴", name: "الأردن" },
        { code: "+965", flag: "🇰🇼", name: "الكويت" },
        { code: "+973", flag: "🇧🇭", name: "البحرين" },
        { code: "+968", flag: "🇴🇲", name: "عمان" },
        { code: "+974", flag: "🇶🇦", name: "قطر" },
        { code: "+961", flag: "🇱🇧", name: "لبنان" },
        { code: "+963", flag: "🇸🇾", name: "سوريا" },
    ];

    const [playersData, setPlayersData] = useState([])
    const [choosedPlayer, setChoosedPlayer] = useState(undefined)
    const [typedPlayerName, setTypedPlayerName] = useState("")
    const [typedPlayerPhone, setTypedPlayerPhone] = useState("")
    const [displayedPhone, setDisplayedPhone] = useState("")
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[2])
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredPlayers, setFilteredPlayers] = useState([])
    const [isPhoneLocked, setIsPhoneLocked] = useState(false)
    const [isNameLocked, setIsNameLocked] = useState(false)
    const [activeField, setActiveField] = useState(null)

    useEffect(() => {
        fetchPlayers();
    }, [groupId])

    const fetchPlayers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/dashboard/users?groupId=${groupId}`);
            if (!response.ok) {
                throw new Error(`خطأ في الاتصال! الحالة: ${response.status}`);
            }
            let responseData = await response.json();

            responseData = responseData.users
            
            if (Array.isArray(responseData)) {
                setPlayersData(responseData);
            } else {
                throw new Error("تنسيق البيانات المستلمة غير صحيح");
            }
        } catch (e) {
            setError(e.message);
            setPlayersData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        updateFilteredPlayers();
    }, [typedPlayerName, typedPlayerPhone, playersData, activeField]);
    
    // Modified effect to only auto-select when there's a COMPLETE match
    useEffect(() => {
        if (choosedPlayer || !playersData.length) return;
        
        // Only auto-select on complete phone matches with at least 5 digits
        if (typedPlayerPhone && typedPlayerPhone.length >= 5) {
            const fullPhone = getFullPhoneNumber();
            const phoneMatch = playersData.find(player => 
                player.phone === fullPhone || 
                // The following ensures it must be a complete match
                (fullPhone.length >= 5 && player.phone === fullPhone)
            );
            
            if (phoneMatch) {
                selectPlayer(phoneMatch);
                return;
            }
        }
    }, [typedPlayerName, typedPlayerPhone, playersData]);

    const updateFilteredPlayers = () => {
        if (!Array.isArray(playersData) || choosedPlayer) {
            setFilteredPlayers([]);
            setShowSuggestions(false);
            return;
        }
        
        let filtered = [];
        
        if (activeField === "name" && typedPlayerName && typedPlayerName.length > 0) {
            filtered = playersData.filter(player =>
                player.name.toLowerCase().includes(typedPlayerName.toLowerCase())
            );
        } else if (activeField === "phone" && typedPlayerPhone && typedPlayerPhone.length > 0) {
            filtered = playersData.filter(player =>
                player.phone.includes(typedPlayerPhone)
            );
        }
        
        setFilteredPlayers(filtered);
        setShowSuggestions(filtered.length > 0);
    };

    // Get the full phone number with country code
    const getFullPhoneNumber = () => {
        if (!typedPlayerPhone) return "";
        return `${selectedCountryCode.code.substring(1)}${typedPlayerPhone.startsWith("0") ? typedPlayerPhone.substring(1) : typedPlayerPhone}`;
    };

    const handleNameChange = (e) => {
        if (isNameLocked) return;
        
        const newName = e.target.value;
        setTypedPlayerName(newName);
        setChoosedPlayer(undefined);
        setIsPhoneLocked(false);
        
        // Create a temporary player with the typed info when there's no selected player
        if (onChange) {
            if (newName || typedPlayerPhone) {
                const tempPlayer = {
                    name: newName,
                    id: "",
                    phone: getFullPhoneNumber()
                };
                onChange(tempPlayer);
            } else {
                onChange(undefined);
            }
        }
    };

    const handlePhoneChange = (e) => {
        if (isPhoneLocked) return;
        
        const inputValue = e.target.value;
        setDisplayedPhone(inputValue); // Keep the original input for display
        
        // Process the input for internal state (remove leading 0)
        let processedValue = inputValue;
        if (inputValue.startsWith('0')) {
            processedValue = inputValue.substring(1);
        }
        
        setTypedPlayerPhone(processedValue);
        setChoosedPlayer(undefined);
        setIsNameLocked(false);
        
        // Create a temporary player with the typed info when there's no selected player
        if (onChange) {
            if (typedPlayerName || processedValue) {
                const tempPlayer = {
                    name: typedPlayerName,
                    id: "",
                    phone: selectedCountryCode.code.substring(1) + processedValue
                };
                onChange(tempPlayer);
            } else {
                onChange(undefined);
            }
        }
    };

    const selectPlayer = (player) => {
        setChoosedPlayer(player);
        setTypedPlayerName(player.name);
        
        // Extract the phone number without country code for display
        let displayPhone = player.phone;
        // Try to remove country code if present
        countryCodes.forEach(code => {
            if (player.phone.startsWith(code.code.substring(1))) {
                displayPhone = player.phone.substring(code.code.length - 1);
            }
        });
        
        setTypedPlayerPhone(displayPhone);
        setDisplayedPhone(displayPhone);
        setShowSuggestions(false);
        setIsPhoneLocked(true);
        setIsNameLocked(true);
        setActiveField(null);
        if (onChange) onChange(player);
    };

    const clearSelection = () => {
        setChoosedPlayer(undefined);
        setTypedPlayerName("");
        setTypedPlayerPhone("");
        setDisplayedPhone("");
        setIsPhoneLocked(false);
        setIsNameLocked(false);
        setActiveField(null);
        if (onChange) onChange(undefined);
    };

    const handleFieldFocus = (field) => {
        setActiveField(field);
        if (!choosedPlayer) {
            updateFilteredPlayers();
        }
    };

    const handleFieldBlur = () => {
        // Small delay to allow clicking on suggestion items
        setTimeout(() => {
            setShowSuggestions(false);
        }, 300);
    };

    const selectCountryCode = (country) => {
        setSelectedCountryCode(country);
        setShowCountryDropdown(false);
        
        // Update onChange with the new country code if there's phone input
        if (onChange && typedPlayerPhone && !choosedPlayer) {
            const tempPlayer = {
                name: typedPlayerName,
                id: "",
                phone: country.code.substring(1) + typedPlayerPhone
            };
            onChange(tempPlayer);
        }
    };

    return (
        <div className="w-full" dir="rtl">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-right">
                    <span>⚠️ {error}</span>
                </div>
            )}
            
            <div className="mb-4 relative">
                <label htmlFor="playerName" className="block text-sm font-medium mb-2 text-right">
                    اسم اللاعب
                </label>
                <div className="relative">
                    <input
                        id="playerName"
                        type="text"
                        value={typedPlayerName}
                        onChange={handleNameChange}
                        disabled={isNameLocked}
                        placeholder="أدخل اسم اللاعب"
                        className={`w-full p-3 py-2 border rounded-lg ${isNameLocked ? 'bg-gray-50 text-gray-500' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} transition-all duration-200 text-right`}
                        onFocus={() => handleFieldFocus("name")}
                        onBlur={handleFieldBlur}
                    />
                    
                    {choosedPlayer && (
                        <button 
                            onClick={clearSelection}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 text-sm transition-colors duration-200"
                            title="مسح الاختيار"
                        >
                            ✕
                        </button>
                    )}
                    
                    {/* Name field suggestions - only show if no player is selected */}
                    {showSuggestions && !choosedPlayer && activeField === "name" && filteredPlayers.length > 0 && (
                        <div className="absolute z-50 w-full md:w-[300px] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {filteredPlayers.map(player => (
                                <div 
                                    key={player.id}
                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-right transition-colors duration-150"
                                    onClick={() => selectPlayer(player)}
                                >
                                    <div className="font-medium text-gray-800">{player.name}</div>
                                    <div className="text-sm text-gray-500 mt-1">{player.phone}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mb-6 relative">
                <label htmlFor="playerPhone" className="block text-sm font-medium mb-2 text-right">
                    رقم الهاتف
                </label>
                <div className="relative flex">

                    {/* Phone input */}
                    <input
                        id="playerPhone"
                        type="tel"
                        value={displayedPhone}
                        onChange={handlePhoneChange}
                        disabled={isPhoneLocked}
                        placeholder="(بالانجيليزية) أدخل رقم الهاتف"
                        className={`flex-grow p-3 py-2 border rounded-r-lg ${isPhoneLocked ? 'bg-gray-50 text-gray-500' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} transition-all duration-200 text-left placeholder:text-right border-l-0`}
                        onFocus={() => handleFieldFocus("phone")}
                        onBlur={handleFieldBlur}
                    />

                    {/* Country code selector */}
                    <div className="relative">
                        <button
                            type="button"
                            className={`flex items-center justify-center h-full px-3 border ${isPhoneLocked ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'} rounded-l-lg`}
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            disabled={isPhoneLocked}
                        >
                            <span>{selectedCountryCode.code}</span>
                        </button>
                        
                        {/* Phone field suggestions - only show if no player is selected */}
                        {showSuggestions && !choosedPlayer && activeField === "phone" && filteredPlayers.length > 0 && (
                            <div className="absolute z-50 left-0 w-[300px] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                {filteredPlayers.map(player => (
                                    <div 
                                        key={player.id}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-right transition-colors duration-150"
                                        onClick={() => selectPlayer(player)}
                                    >
                                        <div className="font-medium text-gray-800">{player.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">{player.phone}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Country codes dropdown */}
                        {showCountryDropdown && !choosedPlayer && (
                            <div className="absolute z-50 left-0 w-[250px] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                {countryCodes.map(country => (
                                    <div 
                                        key={country.code}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                                        onClick={() => selectCountryCode(country)}
                                    >
                                        <span className="mr-2">{country.flag}</span>
                                        <span className="mr-2">{country.code}</span>
                                        <span className="text-gray-600">{country.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChooser;