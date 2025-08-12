"use client";
import "../globals.css";
import { SharedContext } from "@/context/ShareAffiliateAuth";
import Loading from "@/components/Loading";
import { useAffiliateAuth } from "@/context/AffiliateAuthContext";
import { AffiliateAuthProvider } from "@/context/AffiliateAuthContext";
import AffiliateSidebar from "@/components/Affiliate/AffiliateSidebar";
import AffiliateSignInPage from "./signin/page";
import { usePathname } from "next/navigation"; // ✅ import
import AffiliateSignUpPage from "./signup/page";
// Main layout component
export default function RootLayout({ children }) {
  return (
    <AffiliateAuthProvider>
      <AffiliateLayoutContent>{children}</AffiliateLayoutContent>
    </AffiliateAuthProvider>
  );
}

function AffiliateLayoutContent({ children }) {
  const { user, loading } = useAffiliateAuth();
  const pathname = usePathname(); // ✅ get current path

  if (loading) {
    return <Loading />;
  }

  // ✅ Skip showing sign-in page if already on /signup
  if (!user && !loading && pathname !== "/signup") {
    return <AffiliateSignInPage />;
  }

  if (!user && pathname === "/signup") {
    return <AffiliateSignUpPage />;
  }

  return (
    <SharedContext.Provider value={{ user }}>
      <AffiliateSidebar />
      <div className="lg:mr-[260px]">{children}</div>
    </SharedContext.Provider>
  );
}
