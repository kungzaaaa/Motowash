"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, Car, MapPin, Calendar, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewBookingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const steps = [
    { num: 1, title: "เลือกรถ" },
    { num: 2, title: "เลือกบริการ" },
    { num: 3, title: "วัน-เวลา" },
    { num: 4, title: "สถานที่" },
    { num: 5, title: "ชำระเงิน" }
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/tracking/MW-NEW88');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold font-prompt text-[#212529]">จองบริการใหม่</h1>
        <p className="text-[#6C757D]">ทำตามขั้นตอนง่ายๆ เพื่อรับบริการล้างรถถึงที่</p>
      </div>

      {/* Progress Indicator */}
      <Card className="p-4 sm:p-6 mb-8 overflow-hidden">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#0056B3] -z-10 transform -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, idx) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  isActive ? "bg-[#0056B3] text-white ring-4 ring-[#0056B3]/20" : 
                  isCompleted ? "bg-[#28A745] text-white" : 
                  "bg-white border-2 border-gray-300 text-gray-400"
                )}>
                  {isCompleted ? <Check size={16} /> : s.num}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-2 hidden sm:block",
                  isActive ? "text-[#0056B3]" : isCompleted ? "text-[#28A745]" : "text-gray-400"
                )}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          {/* Step 1: Vehicle */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold font-prompt mb-4">เลือกรถที่ต้องการรับบริการ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-[#0056B3] rounded-lg p-4 bg-blue-50 cursor-pointer relative">
                  <div className="absolute top-4 right-4 bg-[#0056B3] text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <Car className="text-[#0056B3] mb-3" size={32} />
                  <h3 className="font-semibold text-lg">Honda PCX 160</h3>
                  <p className="text-[#6C757D] text-sm">1กข 1234 กทม</p>
                  <Badge variant="neutral" className="mt-2">Medium (150-400cc)</Badge>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-[#6C757D] hover:border-[#0056B3] hover:text-[#0056B3] cursor-pointer transition-colors min-h-[140px]">
                  <PlusCircle size={24} className="mb-2" />
                  <span className="font-medium">เพิ่มรถคันใหม่</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold font-prompt mb-4">เลือกบริการสำหรับ Honda PCX 160 (Medium)</h2>
              <div className="space-y-4">
                {[
                  { id: 'standard', name: 'Standard Wash', price: '฿200', desc: 'ล้างทำความสะอาดทั่วไป เหมาะสำหรับการดูแลรักษาเป็นประจำ' },
                  { id: 'premium', name: 'Premium Wash', price: '฿450', desc: 'ทำความสะอาดหมดจด พร้อมลงแว็กซ์ปกป้องสีรถ', popular: true },
                  { id: 'detail', name: 'Full Detail', price: '฿1,200', desc: 'ฟื้นฟูสภาพรถให้กลับมาเหมือนใหม่ ดูแลทุกซอกทุกมุม' },
                ].map(svc => (
                  <div key={svc.id} className={cn(
                    "border-2 rounded-lg p-4 cursor-pointer transition-all",
                    svc.id === 'premium' ? "border-[#0056B3] bg-blue-50/50" : "border-gray-200 hover:border-[#0056B3]/50"
                  )}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg font-prompt">{svc.name}</h3>
                          {svc.popular && <Badge variant="active">ยอดนิยม</Badge>}
                        </div>
                        <p className="text-[#6C757D] text-sm mt-1">{svc.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-[#212529]">{svc.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Summary (Skipping 3 & 4 implementation detail for MVP) */}
          {step >= 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold font-prompt mb-4">สรุปการจองและชำระเงิน</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-semibold text-[#212529]">Premium Wash</h4>
                    <p className="text-sm text-[#6C757D]">Honda PCX 160</p>
                  </div>
                  <span className="font-medium">฿450</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-[#6C757D]">
                  <Calendar size={16} /> วันนี้ (27 ส.ค.), 14:00 น.
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6C757D]">
                  <MapPin size={16} /> คอนโด A, สุขุมวิท 50
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#212529]">เลือกรูปแบบการชำระเงิน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#0056B3] bg-blue-50/50 rounded-lg p-4 relative cursor-pointer">
                    <div className="absolute top-4 right-4 text-[#0056B3]"><CheckCircle2 size={20} /></div>
                    <div className="font-semibold mb-1">จ่ายมัดจำ 40%</div>
                    <div className="text-2xl font-bold text-[#212529] mb-1">฿180</div>
                    <div className="text-xs text-[#6C757D]">จ่ายส่วนที่เหลือ (฿270) เมื่องานเสร็จ</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#0056B3]/50">
                    <div className="font-semibold mb-1">จ่ายเต็มจำนวน 100%</div>
                    <div className="text-2xl font-bold text-[#212529] mb-1">฿450</div>
                    <div className="text-xs text-[#6C757D]">ชำระครั้งเดียวครบจบ</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={step === 1}
            icon={<ArrowLeft size={16} />}
          >
            ย้อนกลับ
          </Button>
          
          {step < 3 ? (
            <Button variant="primary" onClick={handleNext}>
              ถัดไป <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="bg-[#28A745] hover:bg-[#28A745]/90 border-none">
              ชำระเงินและยืนยันการจอง
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
