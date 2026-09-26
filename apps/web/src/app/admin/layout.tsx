import Link from 'next/link';
import { LayoutDashboard, Calendar, Users, Settings, Briefcase, Trello } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: 'แดชบอร์ด', icon: LayoutDashboard, href: '/admin' },
    { name: 'Live Job Board', icon: Trello, href: '/admin/live-board' },
    { name: 'จัดการการจอง', icon: Calendar, href: '/admin/bookings' },
    { name: 'จัดการลูกค้า', icon: Users, href: '/admin/customers' },
    { name: 'จัดการพนักงาน', icon: Briefcase, href: '/admin/staff' },
    { name: 'ตั้งค่าบริการ', icon: Settings, href: '/admin/services' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">MotoWash Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex md:hidden items-center px-4">
          <h1 className="text-lg font-bold text-blue-600">MotoWash Admin</h1>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
