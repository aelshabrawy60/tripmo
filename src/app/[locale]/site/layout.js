import "../../globals.css";
import { headers } from 'next/headers';
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";
import { footerPages, pages, socialMedia } from "./data";
import AffiliateTracker from "@/components/Affiliate/AffiliateTracker";

export const metadata = {
  title: "Rehla Now | رحلة ناو | احجز رحلتك القادمة" ,
  description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now. عروض رائعة، وجهات مميزة، وتجربة سفر لا مثيل لها.",
  keywords: ["رحلات", "حجوزات", "سياحة", "سفر", "مغامرات", "رحلات مصر", "رحلات شرم الشيخ", "Rehla Now", "رحلة ناو", "استكشاف", "عروض سفر", "حجز رحلات"],
  openGraph: {
    title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
    description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now.",
    url: "https://rehlanow.com",
    siteName: "Rehla Now",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
    description: "اكتشف أفضل الرحلات في مصر مع Rehla Now.",
    images: ["https://rehlanow.com/og-image.jpg"],
  },
};

// Function to check if navbar should be hidden
const shouldHideNavbarForPath = (pathname) => {
  const exactHideRoutes = ['/en/booking', '/ar/booking'];
  
  // Check exact matches
  if (exactHideRoutes.includes(pathname)) return true;
  
  // Check trips booking pattern: /en/trips/{id}/book or /ar/trips/{id}/book
  const tripsBookingRegex = /^\/(en|ar)\/trips\/\d+\/book$/;
  if (tripsBookingRegex.test(pathname)) return true;
  
  // Add more patterns here as needed
  // const anotherPattern = /^\/(en|ar)\/another-pattern$/;
  // if (anotherPattern.test(pathname)) return true;
  
  return false;
};

export default function RootLayout({ children, params }) {
  const { locale } = params
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const shouldHideNavbar = shouldHideNavbarForPath(pathname);

  return (
    <>
      <div style={{direction: locale == "en" ? "ltr" : "rtl"}}>
        <MainLayout>
          <AffiliateTracker/>
          {!shouldHideNavbar && <MainNavbar pages={pages} locale={locale}/>}
          <div>{children}</div>
        </MainLayout>
        {!shouldHideNavbar && <MainFooter logo={'/logo.png'} pages={footerPages} socialMedia={socialMedia} locale={locale} />}
      </div>
    </>
  );
}