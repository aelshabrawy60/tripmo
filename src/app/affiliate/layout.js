// app/admin/layout.js
"use client"
import "../globals.css";
import { SharedContext } from "@/context/ShareAdminAuth";
import Loading from "@/components/Loading";
import { useAffiliateAuth } from "@/context/AffiliateAuthContext";
import { AffiliateAuthProvider } from "@/context/AffiliateAuthContext";
import AffiliateSidebar from "@/components/Affiliate/AffiliateSidebar";
import AffiliateSignInPage from "./signin/page";

// Main layout component
export default function RootLayout({ children }) {
  return (
    <AffiliateAuthProvider>
      <AffiliateLayoutContent>{children}</AffiliateLayoutContent>
    </AffiliateAuthProvider>
  );
}

// Inner component that can use the auth context
function AffiliateLayoutContent({ children }) {
  const { user, loading } = useAffiliateAuth(); // Now this works!

  if (loading) {
    return <Loading />;
  }

  if (!user && !loading) {
    return <AffiliateSignInPage />;
  }

  return (
    <SharedContext.Provider value={{ user }}>
      <AffiliateSidebar />
      <div className={'lg:mr-[260px]'}>
        {children}
      </div>
    </SharedContext.Provider>
  );
}