import React from 'react';

const EgyptToursFAQ = () => {
  const faqData = [
    {
      id: 1,
      question: "What are the best Egypt tour packages for first-time visitors?",
      answer: "For first-time visitors, we recommend Classic Egypt tour packages that include Cairo, Luxor, and Aswan. These tours cover essential attractions like the Pyramids of Giza, Egyptian Museum, Valley of the Kings, Karnak Temple, and a Nile cruise."
    },
    {
      id: 2,
      question: "How much do Egypt tours cost and what's included?",
      answer: "Egypt tour prices vary from $800-$3000+ per person depending on duration, accommodation level, and inclusions."
    },
    {
      id: 3,
      question: "When is the best time to visit Egypt for tours?",
      answer: "The best time for Egypt tours is from October to April when temperatures are cooler (20-25°C). This is peak season for Egypt travel, ideal for exploring pyramids, temples, and taking Nile cruises. Summer months (May-September) are extremely hot but offer lower prices. December-February is perfect for Egypt vacation packages as weather is most comfortable."
    },
    {
      id: 4,
      question: "Are Nile cruise tours worth it in Egypt?",
      answer: "Absolutely! Nile cruise tours are one of the best ways to experience Egypt. Our luxury Nile cruises sail between Luxor and Aswan, stopping at ancient temples like Edfu and Kom Ombo. You'll enjoy comfortable cabins, gourmet meals, and expert guides while floating past timeless landscapes. Most Egypt tour packages include 3-4 night Nile cruises as they're essential to the Egyptian experience."
    },
    {
      id: 5,
      question: "What should I pack for Egypt tours?",
      answer: "For Egypt travel, pack lightweight, breathable clothing that covers arms and legs for temple visits. Essential items include: sunscreen, hat, comfortable walking shoes, modest clothing for religious sites, light jacket for evenings, and a scarf. Our Egypt tour guides provide detailed packing lists with your booking confirmation to ensure you're well-prepared for your Egyptian adventure."
    },
    {
      id: 6,
      question: "Do I need a visa for Egypt tours?",
      answer: "Most tourists need a visa for Egypt. You can obtain a tourist visa on arrival at Egyptian airports ($25 USD) or apply online for an e-visa before your Egypt tour through the official Egyptian government portal at <a href='https://www.visa2egypt.gov.eg' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline'>visa2egypt.gov.eg</a>. Your passport must be valid for at least 6 months."
    },
    {
      id: 7,
      question: "Are private Egypt tours better than group tours?",
      answer: "Both have advantages! Private Egypt tours offer personalized itineraries, flexible scheduling, and dedicated Egyptologist guides - perfect for families or couples seeking intimate experiences. Group Egypt tours are more budget-friendly and great for solo travelers to meet others. Our Egypt tour packages include both options, and we help you choose based on your preferences and budget."
    },
    {
      id: 9,
      question: "Is Egypt safe for tourists and tour groups?",
      answer: "Yes, Egypt is safe for tourists, especially on organized tours. Tourist areas like Cairo, Luxor, Aswan, and Red Sea resorts have enhanced security. Our Egypt tour operators work closely with local authorities and follow all safety protocols."
    },
  ];

  return (
    <>
      <section className="py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions About Egypt Tours
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get answers to the most common questions about Egypt travel, tour packages, and vacation planning. 
            Our Egypt tour experts are here to help you plan the perfect Egyptian adventure.
          </p>
        </div>

        <div className="space-y-6">
          {faqData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {item.question}
              </h3>
              <div className="prose max-w-none">
                <p 
                  className="text-gray-700 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer.replace(/<[^>]*>/g, '') // Strip HTML tags for structured data
              }
            }))
          })
        }}
      />
    </>
  );
};

export default EgyptToursFAQ;