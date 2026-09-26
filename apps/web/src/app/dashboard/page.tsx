import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator, BookingStatus } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Car, Calendar, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const userName = "สมชาย"; // Placeholder

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-prompt text-[#212529]">สวัสดีคุณ {userName} 👋</h1>
          <p className="text-[#6C757D]">ยินดีต้อนรับกลับสู่ MotoWash</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Link href="/dashboard/vehicles" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full">ดูรถของฉัน</Button>
          </Link>
          <Link href="/dashboard/bookings/new" className="flex-1 sm:flex-none">
            <Button variant="primary" className="w-full" icon={<PlusCircle size={18} />}>
              จองคิวใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Active Booking */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-prompt text-[#212529]">กำลังดำเนินการ</h2>
        </div>
        <Card variant="bordered" className="border-[#0056B3]/20 shadow-sm bg-blue-50/30">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <Badge variant="active" className="mb-2">พนักงานกำลังเดินทาง</Badge>
                  <h3 className="text-xl font-bold font-prompt text-[#212529]">Premium Wash</h3>
                  <p className="text-[#6C757D] text-sm mt-1">Honda PCX 160 (1กข 1234)</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#6C757D]">Booking ID</div>
                  <div className="font-semibold text-[#212529]">#MW-84920</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
                <StatusIndicator 
                  status={BookingStatus.STAFF_ON_THE_WAY} 
                  showDescription 
                  className="mb-4"
                />
                <ProgressBar value={40} showPercentage color="bg-[#0056B3]" />
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/tracking/MW-84920">
                  <Button variant="primary" className="w-full sm:w-auto" icon={<ArrowRight size={16} />}>
                    ติดตามสถานะ
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Bookings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-prompt text-[#212529]">ประวัติการจองล่าสุด</h2>
          <Link href="/dashboard/bookings" className="text-sm text-[#0056B3] hover:underline flex items-center">
            ดูทั้งหมด <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "MW-84801", date: "15 ส.ค. 2026", service: "Standard Wash", vehicle: "Yamaha XMAX", status: "completed", price: "฿200" },
            { id: "MW-84512", date: "2 ส.ค. 2026", service: "Full Detail", vehicle: "Honda CB650R", status: "completed", price: "฿1,200" },
          ].map((booking, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2 text-sm text-[#6C757D]">
                    <Calendar size={14} />
                    <span>{booking.date}</span>
                  </div>
                  <Badge variant="success">เสร็จสมบูรณ์</Badge>
                </div>
                <h3 className="font-semibold text-[#212529]">{booking.service}</h3>
                <div className="flex items-center space-x-2 text-sm text-[#6C757D] mt-1 mb-4">
                  <Car size={14} />
                  <span>{booking.vehicle}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="font-medium text-[#212529]">{booking.price}</span>
                  <Link href={`/dashboard/bookings/${booking.id}`} className="text-sm text-[#0056B3] hover:underline">
                    ดูรายละเอียด
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
