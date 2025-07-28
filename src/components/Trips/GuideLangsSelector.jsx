import { useEffect, useState } from "react";
import LangSelector from "./LangSelector";
import { languages } from "./LangSelector"; // Import the languages list
import { X } from "lucide-react";
// GuideLangsSelector Component
function GuideLangsSelector({ initLangs = ['ar'], onEdit }) {
  const [langs, setLangs] = useState(initLangs);

  useEffect(()=>{
    onEdit(langs)
  }, [])

  useEffect(() => {
    onEdit?.(langs);
  }, [langs]);

  function removeLang(lang) {
    setLangs(langs?.filter((l) => l !== lang));
  }

  function addLang(lang) {
    if (!langs?.includes(lang)) {
      setLangs([...langs, lang]);
    }
  }

  // Get language display info
  const getLanguageInfo = (code) => {
    return languages.find(lang => lang.code === code) || { code, name: code, englishName: code };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">لغات المرشد</h3>
        <span className="text-sm text-gray-500">({langs?.length} لغة)</span>
      </div>

      {/* Selected Languages */}
      <div className="space-y-2">
        {langs?.length > 0 ? (
          langs?.map((langCode) => {
            const langInfo = getLanguageInfo(langCode);
            return (
              <div
                key={langCode}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-mono text-blue-700 uppercase">
                      {langCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-gray-800">{langInfo.name}</div>
                    <div className="text-xs text-gray-500">{langInfo.englishName}</div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeLang(langCode)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors group"
                  title="إزالة اللغة"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌐</span>
            </div>
            <p>لم يتم اختيار أي لغة بعد</p>
          </div>
        )}
      </div>

      {/* Add Language Button */}
      <div className="pt-2">
        <LangSelector onSelect={addLang} />
      </div>
    </div>
  );
}

export default GuideLangsSelector;