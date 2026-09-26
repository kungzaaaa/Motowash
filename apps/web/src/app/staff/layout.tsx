import Link from 'next/link';
import { Calendar, History, User } from 'lucide-react';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-16">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4">
        <Link href="/staff" className="flex flex-col items-center text-blue-600">
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">งานของวันนี้</span>
        </Link>
        <Link href="/staff/history" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
          <History className="w-6 h-6" />
          <span className="text-xs mt-1">ประวัติงาน</span>
        </Link>
        <Link href="/staff/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">โปรไฟล์</span>
        </Link>
      </nav>
    </div>
  );
}
