"use client"
// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ChevronRight, ChevronLeft} from 'react-feather';
import { usePathname } from 'next/navigation';
import { BanknoteArrowDown, FileText, HomeIcon, MapPlus, Settings, Settings2, SettingsIcon, Ticket, Tickets, TicketSlash, User, Users, Wallet } from 'lucide-react';
import { roles } from '@/utils/middleware/AdminRoles';

// Define your sidebar items function that filters based on role
const getSidebarItems = (userRole) => {
  const allItems = [
    {
      title: 'الرئيسية',
      path: '/',
      icon: <HomeIcon size={20} />,
    },
    {
      title: "الحجوزات",
      path: '/bookings',
      icon: <Tickets size={20}/>
    },
    {
      title : 'عمليات الاسترداد',
      path: '/refunds',
      icon: <TicketSlash size={20}/>
    },
    {
      title: 'عمليات السحب',
      path: '/withdraws',
      icon: <BanknoteArrowDown size={20} />,
    },
    {
      title: "الرحلات",
      path: '/trips',
      icon: <MapPlus size={20}/>
    },
    {
      title: "مقدمي الخدمات",
      path: '/hosts',
      icon: <Users size={20}/>
    },
    {
      title: "الإيرادات",
      path: '/revenue',
      icon: <Wallet size={20}/>
    },
  ];

  // Find the role configuration
  const roleConfig = roles.find(role => role.name === userRole);
  
  // If role not found, return empty array for security
  if (!roleConfig) {
    return [];
  }

  // Filter items based on disallowed paths
  const filteredItems = allItems.filter(item => {
    // Extract the path without leading slash for comparison
    const pathSegment = item.path.replace('/', '');
    
    // Allow home page for all roles
    if (pathSegment === '') {
      return true;
    }
    
    // Check if the path is in the disallowed list
    return !roleConfig.disallowedPaths.includes(pathSegment);
  });

  return filteredItems;
};

// Custom logo component
const logo = (
  <img src='/logo.png' width={70}></img>
);

// Footer content
const footerContent = null

const AdminSidebar = ({
  title = 'لوحة التحكم',
  defaultExpanded = true,
  onToggle,
  className = '',
  activeItemClassName = 'bg-blue-50 text-tripmo-500 border-r-4 border-tripmo-500',
  itemClassName = 'text-gray-700 hover:bg-gray-100',
  logoClassName = '',
  groupId = null,
  role = "owner"
}) => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({}); // Initialize with empty object
  const [mounted, setMounted] = useState(false);  

  
  // Get the filtered sidebar items based on user role
  const items = getSidebarItems(role);

  // Handle hydration mismatch by only rendering the full component after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(defaultExpanded);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [defaultExpanded]);

  useEffect(()=>{
    console.log("role", role)
  }, [groupId])


  // Handle toggle sidebar
  const toggleSidebar = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    if (onToggle) {
      onToggle(newExpandedState);
    }
    
    if (isMobile) {
      setMobileOpen(newExpandedState);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
    setExpanded(!mobileOpen);
    
    if (onToggle) {
      onToggle(!mobileOpen);
    }
  };

  // Close mobile sidebar when a navigation item is clicked
  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
      setExpanded(false);
      
      if (onToggle) {
        onToggle(false);
      }
    }
  };

  // Toggle nested items
  const toggleNestedItem = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Check if a path is active
  const isActiveLink = (path) => {
    if (!mounted || !pathname) return false;
    return pathname === path || (pathname.startsWith(`${path}/`) && path !== '/');
  };

  // Render sidebar items
  const renderItems = (items, level = 0) => {
    return items.map((item, index) => {
      const isActive = isActiveLink(item.path);
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems && expandedItems[item.title];
      
      return (
        <div key={index} className={`${level > 0 ? 'mr-4' : ''}`}>
          {hasChildren ? (
            <div className="flex flex-col">
              <button
                onClick={() => toggleNestedItem(item.title)}
                className={`flex items-center justify-between py-2.5 px-4 rounded-md my-1 transition-colors w-full ${
                  isActive ? activeItemClassName : itemClassName
                }`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center">
                  {item.icon && (
                    <div className={`${expanded ? 'ml-3' : 'mx-auto'} text-lg`}>
                      {item.icon}
                    </div>
                  )}
                  {(expanded || isMobile) && (
                    <span className="whitespace-nowrap">{item.title}</span>
                  )}
                </div>
                {(expanded || isMobile) && (
                  <ChevronLeft
                    size={16}
                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                )}
              </button>
              
              {isExpanded && (expanded || isMobile) && (
                <div className="mr-2 border-r pr-2 border-gray-200">
                  {renderItems(item.children, level + 1)}
                </div>
              )}
            </div>
          ) : (
            <Link 
              href={item.path} 
              prefetch 
              onClick={closeMobileSidebar}
            >
              <div
                className={`flex items-center justify-between py-2.5 px-4 rounded-md my-1 transition-colors cursor-pointer ${
                  isActive ? activeItemClassName : itemClassName
                }`}
              >
                <div className="flex items-center">
                  {item.icon && (
                    <div className={`${expanded ? 'ml-3' : 'mx-auto'} text-lg`}>
                      {item.icon}
                    </div>
                  )}
                  {(expanded || isMobile) && (
                    <span className="whitespace-nowrap">{item.title}</span>
                  )}
                </div>
                {item.badge && (expanded || isMobile) && (
                  <div className="bg-tripmo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      );
    });
  };

  // Only render the full component after mounting to avoid hydration issues
  if (!mounted) {
    return (
      <aside 
        className={`h-screen bg-white fixed top-0 right-0 z-40 w-0 lg:w-20 ${className}`}
        dir="rtl"
      />
    );
  }

  return (
    <>
      {/* Mobile navbar */}
      {isMobile && (
        <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-md h-12 flex items-center justify-between px-4 lg:hidden">
          {/* Menu button on right */}
          <div>
            <button
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              <Menu size={24} />
            </button>
          </div>
          
          
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <img src='/logo.png' width={40}></img>
          </div>
        </nav>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 mt-12"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen bg-white fixed top-0 right-0 z-40 flex flex-col transition-all duration-300 overflow-hidden shadow-lg
          ${isMobile ? (mobileOpen ? 'w-64 top-12' : 'w-0') : expanded ? 'w-64' : 'w-20'}
          ${className}
        `}
        dir="rtl"
      >
        {/* Logo and toggle button (only show on desktop) */}
        {!isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className={`flex items-center ${logoClassName}`}>
              {logo && <div className={`${expanded ? 'ml-3' : 'mx-auto'}`}>{logo}</div>}
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={expanded ? "تصغير القائمة" : "توسيع القائمة"}
            >
              {expanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        )}

        {/* Menu items container */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {renderItems(items)}
        </div>

        {/* Footer */}
        {footerContent && (
          <div className={`border-t mb-10 md:mb-0 p-4 ${!expanded && !isMobile ? 'text-center' : ''}`}>
            {footerContent}
          </div>
        )}
      </aside>

      {/* Main content area - adds margin when sidebar is expanded and padding-top on mobile for the navbar */}
      <div 
        className={`transition-all duration-300 ${
          isMobile ? 'mr-0 pt-12' : expanded ? 'mr-64' : 'mr-20'
        }`}
      >
        {/* This is where your main content would go */}
      </div>
    </>
  );
};

export default AdminSidebar;