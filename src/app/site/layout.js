import "../globals.css";
import { headers } from 'next/headers';
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";
import { footerPages, pages, socialMedia } from "./data";

export const metadata = {
  title: "رحلة ناو | احجز رحلتك القادمة",
  description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now. عروض رائعة، وجهات مميزة، وتجربة سفر لا مثيل لها.",
  keywords: ["رحلات", "حجوزات", "سياحة", "سفر", "مغامرات", "رحلات مصر", "رحلات شرم الشيخ", "Rehla Now", "رحلة ناو", "استكشاف", "عروض سفر", "حجز رحلات"],
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
      </head>
      <body>
        <MainLayout>
          {!shouldHideNavbar && <MainNavbar pages={pages} />}
          <div>{children}</div>
        </MainLayout>
        {!shouldHideNavbar && <MainFooter logo={'/logo.png'} pages={footerPages} socialMedia={socialMedia} />}
      </body>
    </html>
  );
}
