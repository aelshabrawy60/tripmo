import { Tajawal } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
});

export const metadata = {
  title: "رحلة ناو | احجز رحلتك القادمة",
  description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html>
        <body className={`${tajawal.variable} antialiased`}>
          {/* Google Tag */}
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-WN20P3M769"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-WN20P3M769');
              `,
            }}
          />

          {/* Meta Pixel #1 */}
          <Script
            id="facebook-pixel-1"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1408325113648819');
                fbq('track', 'PageView');
              `,
            }}
          />

          {/* Meta Pixel #2 */}
          <Script
            id="facebook-pixel-2"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                fbq('init', '1266145115303197');
                fbq('track', 'PageView');
              `,
            }}
          />

          {/* Noscript fallback */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1408325113648819&ev=PageView&noscript=1"
            />
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1266145115303197&ev=PageView&noscript=1"
            />
          </noscript>

          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
