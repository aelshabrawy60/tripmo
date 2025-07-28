import React, { useEffect } from 'react';

const InstagramEmbed = () => {
  useEffect(() => {
    // Load Instagram embed script after component mounts
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    // Cleanup if needed
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const embedHTML = `
    <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DMfQrNst6f4/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px rgba(0,0,0,0.5), 0 1px 10px rgba(0,0,0,0.15); margin:1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    </blockquote>
  `;

  return (
    <div
      className="instagram-embed"
      dangerouslySetInnerHTML={{ __html: embedHTML }}
    />
  );
};

export default InstagramEmbed;
