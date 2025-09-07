import "../../globals.css";
import { headers } from 'next/headers';
import { Tajawal } from "next/font/google";
import { Roboto } from "next/font/google";
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";
import { footerPages, pages, socialMedia } from "./data";
import AffiliateTracker from "@/components/Affiliate/AffiliateTracker";

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
});


// Dynamic metadata generation function
export async function generateMetadata({ params }) {
  const { locale } = params;
  
  if (locale === 'en') {
    return {
      title: "Rehla Now | Book Your Next Adventure",
      description: "Discover the best trips and tours in Egypt, book your journey easily, and embark on an unforgettable adventure with Rehla Now.",
      keywords: ["trips", "bookings", "tourism", "travel", "adventures", "Egypt trips", "Sharm El Sheikh trips", "Rehla Now", "exploration", "travel deals", "trip booking"],
      openGraph: {
        title: "Trips - Explore, Book and Enjoy the Best Deals",
        description: "Discover the best trips and tours in Egypt, book your journey easily, and embark on an unforgettable adventure with Rehla Now.",
        url: "https://rehlanow.com/en",
        siteName: "Rehla Now",
        type: "website",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: "Trips - Explore, Book and Enjoy the Best Deals",
        description: "Discover the best trips in Egypt with Rehla Now.",
        images: ["https://rehlanow.com/og-image.jpg"],
      },
    };
  } else {
    // Arabic metadata (default)
    return {
      title: "Rehla Now | رحلة ناو | احجز رحلتك القادمة",
      description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now. عروض رائعة، وجهات مميزة، وتجربة سفر لا مثيل لها.",
      keywords: ["رحلات", "حجوزات", "سياحة", "سفر", "مغامرات", "رحلات مصر", "رحلات شرم الشيخ", "Rehla Now", "رحلة ناو", "استكشاف", "عروض سفر", "حجز رحلات"],
      openGraph: {
        title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
        description: "اكتشف أفضل الرحلات في مصر، احجز رحلتك بسهولة، وانطلق في مغامرة لا تُنسى مع Rehla Now.",
        url: "https://rehlanow.com/ar",
        siteName: "Rehla Now",
        type: "website",
        locale: "ar_EG",
      },
      twitter: {
        card: "summary_large_image",
        title: "رحلات - استكشف، احجز واستمتع بأفضل العروض",
        description: "اكتشف أفضل الرحلات في مصر مع Rehla Now.",
        images: ["https://rehlanow.com/og-image.jpg"],
      },
    };
  }
}

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
  const { locale } = params;
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  const shouldHideNavbar = shouldHideNavbarForPath(pathname);

  // 👇 choose font depending on locale
  const fontClass = locale === "ar" ? tajawal.className : roboto.className;

  return (
    <>
      <div
        className={fontClass}
        style={{ direction: locale === "en" ? "ltr" : "rtl" }}
        lang={locale}
      >
        <MainLayout>
          <AffiliateTracker />
          {!shouldHideNavbar && <MainNavbar pages={pages} locale={locale} />}
          <div>{children}</div>
        </MainLayout>
        {!shouldHideNavbar && (
          <MainFooter
            logo={"/logo.png"}
            pages={footerPages}
            socialMedia={socialMedia}
            locale={locale}
          />
        )}
      </div>
    </>
  );
}