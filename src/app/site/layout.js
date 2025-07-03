import "../globals.css";
import { headers } from 'next/headers';
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";

export const metadata = {
  title: "رحلة ناو | احجز رحلتك القادمة",
  description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع RehlaNow. عروض رائعة، وجهات مميزة، وتجربة سفر لا مثيل لها.",
  keywords: ["رحلات", "حجوزات", "سياحة", "سفر", "مغامرات", "رحلات مصر", "رحلات شرم الشيخ", "RehlaNow"],
  openGraph: {
    title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
    description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع RehlaNow.",
    url: "https://rehlanow.com",
    siteName: "RehlaNow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
    description: "اكتشف أفضل الرحلات في مصر مع RehlaNow.",
    images: ["https://rehlanow.com/og-image.jpg"],
  },
};

const pages = [
  { name: 'اعرض رحلاتك', link: `https://host.rehlanow.com` },
];

const footerPages = [
  { name: 'اعرض رحلاتك', link: `https://host.rehlanow.com` },
  { name: "الشروط والأحكام", link: "/terms" },
  { name: "سياسة الاسترداد", link: "/terms#cancellation-policy" },
];

const socialMedia = [
  { name: "facebook", link: 'https://www.facebook.com/share/1AcqvmjMYw' },
  { name: "instagram", link: 'https://www.instagram.com/rehlanow/profilecard/?igsh=cWl0dm4zMzcxZW1l' }
];

export default function RootLayout({ children }) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  const hideNavbarRoutes = ['/booking'];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="ar">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WN20P3M769"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WN20P3M769');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <script
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1408325113648819&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>

      <body>
        <MainLayout>
          {!shouldHideNavbar && <MainNavbar pages={pages} />}
          <div>{children}</div>
          {!shouldHideNavbar && <MainFooter logo={'/logo.png'} pages={footerPages} socialMedia={socialMedia} />}
        </MainLayout>
      </body>
    </html>
  );
}
