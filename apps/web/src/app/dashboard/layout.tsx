"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Car, CreditCard, Bell, User, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
    { name: "การจองของฉัน", href: "/dashboard/bookings", icon: CalendarClock },
    { name: "รถของฉัน", href: "/dashboard/vehicles", icon: Car },
    { name: "ประวัติการชำระเงิน", href: "/dashboard/payments", icon: CreditCard },
    { name: "แจงเตือน", href: "/dashboard/notifications", icon: Bell },
    { name: "โปรไฟล์", href: "/dashboard/profile", icon: User },
    { name: "ตั้งค่า", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0056B3] text-white flex items-center justify-between p-4 sticky top-0 z-50 shadow-sm">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl">🏍️</span>
          <span className="text-lg font-bold font-prompt">MotoWash</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 focus:outline-none">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="hidden md:flex items-center justify-center h-16 border-b border-[#E5E7EB]">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏍️</span>
              <span className="text-xl font-bold font-prompt text-[#0056B3]">MotoWash</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                      isActive 
                        ? "bg-[#0056B3]/10 text-[#0056B3]" 
                        : "text-[#6C757D] hover:bg-gray-100 hover:text-[#212529]"
                    )}
                  >
                    <Icon className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-[#0056B3]" : "text-[#6C757D] group-hover:text-[#212529]")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 border-t border-[#E5E7EB]">
            <Link href="/login" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-[#DC3545] hover:bg-[#DC3545]/10 transition-colors">
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
              ออกจากระบบ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden relative">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
