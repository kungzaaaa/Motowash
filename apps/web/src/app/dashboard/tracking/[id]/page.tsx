"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle2, ArrowLeft, Phone, ShieldCheck, Camera, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Mock Real-time progress
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(BookingStatus.WASHING);
  
  const timelineSteps = [
    { status: BookingStatus.BOOKING_CREATED, time: "10:00 น." },
    { status: BookingStatus.PAYMENT_CONFIRMED, time: "10:05 น." },
    { status: BookingStatus.STAFF_ASSIGNED, time: "10:10 น." },
    { status: BookingStatus.STAFF_ON_THE_WAY, time: "10:15 น." },
    { status: BookingStatus.ARRIVED, time: "10:30 น." },
    { status: BookingStatus.VEHICLE_RECEIVED, time: "10:35 น." },
    { status: BookingStatus.VEHICLE_INSPECTION, time: "10:40 น." },
    { status: BookingStatus.WASHING, time: "กำลังดำเนินการ" },
    { status: BookingStatus.DETAILING, time: null },
    { status: BookingStatus.FINAL_INSPECTION, time: null },
    { status: BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION, time: null },
    { status: BookingStatus.COMPLETED, time: null }
  ];

  const currentIndex = timelineSteps.findIndex(s => s.status === currentStatus);
  const progressPercent = Math.round((currentIndex / (timelineSteps.length - 1)) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-200 text-[#6C757D] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-prompt text-[#212529]">ติดตามสถานะการล้าง</h1>
          <p className="text-[#6C757D] text-sm">Booking #{id || 'MW-84920'}</p>
        </div>
      </div>

      {/* Hero Status Card */}
      <Card variant="elevated" className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-[#0056B3] to-[#17A2B8] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative z-10">
            <h2 className="text-lg font-medium opacity-90 mb-2 font-prompt">รถของคุณกำลังอยู่ในขั้นตอน</h2>
            <div className="flex justify-center mb-6">
              <StatusIndicator 
                status={currentStatus} 
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white !text-white [&_span]:!text-white" 
              />
            </div>
            <div className="px-4">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>ความคืบหน้า</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-white/20 shadow-inner">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000 ease-in-out relative" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold font-prompt text-[#212529] mb-6 flex items-center">
                <ShieldCheck className="mr-2 text-[#0056B3]" size={20} /> 
                ไทม์ไลน์บริการ
              </h3>
              
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 pb-4 ml-3">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  const isFuture = idx > currentIndex;
                  
                  return (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <div className={cn(
                        "absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white",
                        isCompleted ? "border-[#28A745] text-[#28A745]" : 
                        isCurrent ? "border-[#0056B3] text-[#0056B3]" : 
                        "border-gray-300 text-transparent"
                      )}>
                        {isCompleted && <Check size={12} strokeWidth={4} />}
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-[#0056B3] animate-pulse"></div>}
                      </div>

                      <div className={cn(
                        "flex justify-between items-start transition-opacity",
                        isFuture ? "opacity-50" : "opacity-100"
                      )}>
                        <div>
                          <StatusIndicator status={step.status} />
                          {isCurrent && (
                            <p className="text-xs text-[#0056B3] mt-2 font-medium">
                              พนักงานกำลังดูแลรถของคุณอย่างใกล้ชิด
                            </p>
                          )}
                        </div>
                        {step.time && (
                          <span className="text-xs text-[#6C757D] bg-gray-50 px-2 py-1 rounded">
                            {step.time}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold font-prompt text-[#212529] mb-4 text-sm uppercase tracking-wider text-[#6C757D]">ข้อมูลพนักงาน</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Staff" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-[#212529]">วิชัย ใจสู้</p>
                  <p className="text-xs text-[#6C757D]">คะแนน 4.9 ★ (120 งาน)</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs" icon={<Phone size={14} />}>
                โทรติดต่อพนักงาน
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold font-prompt text-[#212529] mb-3 text-sm uppercase tracking-wider text-[#6C757D]">สรุปข้อมูล</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">บริการ:</span>
                  <span className="font-medium">Premium Wash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">รถ:</span>
                  <span className="font-medium text-right">Honda PCX 160<br/>1กข 1234 กทม</span>
                </div>
              </div>
              
              <hr className="my-4 border-gray-100" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6C757D]">
                  <span>ราคาเต็ม:</span>
                  <span>฿450</span>
                </div>
                <div className="flex justify-between text-[#28A745]">
                  <span>ชำระแล้ว (มัดจำ 40%):</span>
                  <span>-฿180</span>
                </div>
                <div className="flex justify-between font-bold text-[#212529] text-base pt-2">
                  <span>ยอดค้างชำระ:</span>
                  <span className="text-[#DC3545]">฿270</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditional Action Button based on status */}
          {currentStatus === BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION && (
            <Card className="border-[#0056B3] bg-blue-50/50 shadow-md">
              <CardContent className="p-5 text-center">
                <Camera className="mx-auto text-[#0056B3] mb-2" size={24} />
                <h3 className="font-bold text-[#212529] mb-1 font-prompt">รถของคุณพร้อมแล้ว!</h3>
                <p className="text-sm text-[#6C757D] mb-4">กรุณาตรวจสอบความเรียบร้อยและกดยืนยัน</p>
                <Button className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white">
                  ยืนยันรับงาน
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStatus === BookingStatus.PAYMENT_REMAINING && (
            <Button className="w-full" size="lg">
              ชำระยอดคงเหลือ (฿270)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
