"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Calendar, Car, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "ทั้งหมด" },
    { id: "active", label: "กำลังดำเนินการ" },
    { id: "completed", label: "เสร็จสิ้น" },
    { id: "cancelled", label: "ยกเลิก" },
  ];

  const mockBookings = [
    { id: "MW-84920", date: "วันนี้, 10:00", service: "Premium Wash", vehicle: "Honda PCX 160", status: "active", statusLabel: "กำลังล้างรถ", price: "฿450" },
    { id: "MW-84801", date: "15 ส.ค. 2026", service: "Standard Wash", vehicle: "Yamaha XMAX", status: "completed", statusLabel: "เสร็จสมบูรณ์", price: "฿200" },
    { id: "MW-84512", date: "2 ส.ค. 2026", service: "Full Detail", vehicle: "Honda CB650R", status: "completed", statusLabel: "เสร็จสมบูรณ์", price: "฿1,200" },
    { id: "MW-84201", date: "20 ก.ค. 2026", service: "Standard Wash", vehicle: "Honda PCX 160", status: "cancelled", statusLabel: "ยกเลิก", price: "฿200" },
  ];

  const filteredBookings = activeTab === "all" 
    ? mockBookings 
    : mockBookings.filter(b => b.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-prompt text-[#212529]">การจองของฉัน</h1>
          <p className="text-[#6C757D]">จัดการและดูประวัติการจองบริการของคุณ</p>
        </div>
        <Link href="/dashboard/bookings/new">
          <Button variant="primary" icon={<PlusCircle size={18} />}>
            จองคิวใหม่
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  activeTab === tab.id 
                    ? "bg-[#0056B3] text-white" 
                    : "bg-gray-100 text-[#6C757D] hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input className="pl-10 h-10 w-full" placeholder="ค้นหา Booking ID หรือ รุ่นรถ..." />
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="hidden md:flex w-12 h-12 bg-blue-50 rounded-full items-center justify-center text-[#0056B3]">
                      <Car size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-[#212529]">#{booking.id}</span>
                        <Badge 
                          variant={
                            booking.status === 'active' ? 'active' : 
                            booking.status === 'completed' ? 'success' : 'error'
                          }
                        >
                          {booking.statusLabel}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-[#212529] font-prompt">{booking.service}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-[#6C757D]">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                        <span className="flex items-center gap-1"><Car size={14} /> {booking.vehicle}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 w-full md:w-auto">
                    <span className="font-semibold text-lg text-[#212529] md:mb-3">{booking.price}</span>
                    {booking.status === 'active' ? (
                      <Link href={`/dashboard/tracking/${booking.id}`}>
                        <Button variant="primary" size="sm">ติดตามสถานะ</Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm">รายละเอียด</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[#6C757D]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p>ไม่พบรายการจองในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
