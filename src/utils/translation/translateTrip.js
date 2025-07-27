import { detectLanguage, translateText } from "./helpers";

export async function translateTrip(tripData) {
    const translationTasks = {
        name: translateSection(tripData.name),
        description: translateSection(tripData.about),
        meeting_point_note: (tripData.start_location?.type === "meeting_point" && tripData.start_location?.notes)
            ? translateSection(tripData.start_location.notes)
            : Promise.resolve(null),
        pickup_note: (tripData.start_location?.type === "pickup" && tripData.start_location?.description)
            ? translateSection(tripData.start_location.description)
            : Promise.resolve(null),
    };

    const [name, description, meeting_point_note, pickup_note] = await Promise.all([
        translationTasks.name,
        translationTasks.description,
        translationTasks.meeting_point_note,
        translationTasks.pickup_note,
    ]);

    return {
        name,
        description,
        meeting_point_note,
        pickup_note,
    };
}

async function translateSection(text) {
    const lang = detectLanguage(text);
    const translatedLang = lang === "ar" ? "en" : "ar";
    const translatedText = await translateText(text, translatedLang);
    return {
        main_lang: lang,
        translation: {
            [translatedLang]: translatedText
        }
    };
}
