import "../globals.css";
import { headers } from 'next/headers';
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";
import Head from 'next/head';

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
  {name: "الشروط والأحكام", link: "/terms"}
]
const socialMedia = [
  {name: "facebook", link: 'https://www.facebook.com/share/1AcqvmjMYw'},
  {name: "instagram", link: 'https://www.instagram.com/rehlanow/profilecard/?igsh=cWl0dm4zMzcxZW1l'}
];

export default function RootLayout({ children }) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const hideNavbarRoutes = ['/booking'];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      <Head>
      <meta name="apple-mobile-web-app-title" content="MyWebSite" />
      </Head>
      <MainLayout>
        {!shouldHideNavbar && <MainNavbar pages={pages} />}
        <div>{children}</div>
        {!shouldHideNavbar && <MainFooter logo={'/logo.png'} pages={footerPages} socialMedia={socialMedia} />}
      </MainLayout>
    </>
  );
}
