// app/admin/layout.js
"use client"
import "../globals.css";
import { SharedContext } from "@/context/ShareAdminAuth";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import AdminSignInPage from "./signin/page";
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/Sidebar/AdminSidebar";

// Main layout component
export default function RootLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}

// Inner component that can use the auth context
function AdminLayoutContent({ children }) {
  const { user, loading } = useAdminAuth(); // Now this works!

  if (loading) {
    return <Loading />;
  }

  if (!user && !loading) {
    return <AdminSignInPage />;
  }

  return (
    <SharedContext.Provider value={{ user }}>
      <AdminSidebar role={user.role}/>
      <div className={'lg:mr-[260px]'}>
        {children}
      </div>
    </SharedContext.Provider>
  );
}