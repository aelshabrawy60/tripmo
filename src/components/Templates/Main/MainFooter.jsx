import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function MainFooter({ logo, pages, socialMedia, contactInfo, theme = "#3B82F6" }) {
  // Function to render the appropriate social media icon
  const getSocialIcon = (name) => {
    const iconProps = { size: 20, style: { color: theme } };
    const iconName = name.toLowerCase();
    
    if (iconName.includes('facebook')) return <Facebook {...iconProps} />;
    if (iconName.includes('twitter') || iconName.includes('x')) return <Twitter {...iconProps} />;
    if (iconName.includes('instagram')) return <Instagram {...iconProps} />;
    if (iconName.includes('linkedin')) return <Linkedin {...iconProps} />;
    return <Mail {...iconProps} />; // Default icon
  };

  // Default contact info if not provided
  const defaultContactInfo = {
    address: "مصر , دمياط الجديدة",
    phone: "01061455364",
    email: "info@rehlanow.com"
  };

  // Use provided contact info or fallback to defaults
  const contact = contactInfo || defaultContactInfo;

  return (
    <footer className="text-gray-800 mt-10">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-x-20 gap-y-8">
          
          {/* Company Info */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <div className="flex items-center mb-4">
              {logo ? (
                <img 
                  src={logo} 
                  alt="شعار الشركة" 
                  className="h-20 w-auto"
                />
              ) : (
                <div className="text-2xl font-bold" style={{ color: theme }}>شعاري</div>
              )}
            </div>
            <p className="text-gray-600 mb-4 text-right">
              نحن نسعى لتقديم أفضل الخدمات لعملائنا الكرام، ونتطلع دائمًا لخلق تجربة مستخدم فريدة ومميزة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {socialMedia && socialMedia.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link || "#"} 
                  className="bg-gray-100 p-2 rounded-full hover:opacity-80 transition duration-300"
                  style={{ 
                    ':hover': { backgroundColor: `${theme}20` } 
                  }}
                  target='_blank'
                  aria-label={item.name}
                >
                  {getSocialIcon(item.name)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-6 md:mb-0 md:w-1/4">
            <h3 className="text-lg font-bold mb-4 text-right" style={{ color: theme }}>روابط سريعة</h3>
            <ul className="space-y-2 text-right">
              {pages && pages.map((page, index) => (
                <li key={index}>
                  <a 
                    href={page.link || "#"} 
                    className="text-gray-600 hover:opacity-80 transition duration-300"
                    style={{ 
                      ':hover': { color: theme } 
                    }}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-bold mb-4 text-right" style={{ color: theme }}>اتصل بنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={20} style={{ color: theme }} className="flex-shrink-0" />
                <span className="text-gray-600">{contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} style={{ color: theme }} className="flex-shrink-0" />
                <span className="text-gray-600">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3 ">
                <Mail size={20} style={{ color: theme }} className="flex-shrink-0" />
                <span className="text-gray-600">{contact.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}