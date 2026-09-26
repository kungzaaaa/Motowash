import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: "standard",
      title: "Standard Wash",
      shortDesc: "ล้างทำความสะอาดทั่วไป เหมาะสำหรับการดูแลรักษาเป็นประจำ",
      features: [
        "ล้างทำความสะอาดภายนอก",
        "ฉีดล้างคราบฝังแน่น",
        "ทำความสะอาดล้อและยาง",
        "เช็ดแห้งเก็บรายละเอียดเบื้องต้น",
        "ใช้เวลาประมาณ 30-45 นาที"
      ],
      priceSmall: "150",
      priceMedium: "200",
      priceLarge: "300"
    },
    {
      id: "premium",
      title: "Premium Wash",
      shortDesc: "ทำความสะอาดหมดจด พร้อมลงแว็กซ์ปกป้องสีรถ",
      popular: true,
      features: [
        "รวมบริการ Standard Wash ทั้งหมด",
        "ลงแว็กซ์เคลือบเงาสีรถ",
        "ทำความสะอาดเบาะหนัง",
        "เคลือบเงายางดำ",
        "ใช้เวลาประมาณ 60-90 นาที"
      ],
      priceSmall: "300",
      priceMedium: "450",
      priceLarge: "600"
    },
    {
      id: "full-detail",
      title: "Full Detail",
      shortDesc: "ฟื้นฟูสภาพรถให้กลับมาเหมือนใหม่ ดูแลทุกซอกทุกมุม",
      features: [
        "รวมบริการ Premium Wash ทั้งหมด",
        "ขจัดคราบยางมะตอย/คราบฝังลึก",
        "ขัดเคลือบชุดสีลบรอยขนแมวเบา",
        "ทำความสะอาดเครื่องยนต์เบื้องต้น",
        "ใช้เวลาประมาณ 2-3 ชั่วโมง"
      ],
      priceSmall: "800",
      priceMedium: "1200",
      priceLarge: "1800"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold font-prompt text-[#212529] mb-4">บริการของเรา</h1>
            <p className="text-[#6C757D] max-w-2xl mx-auto text-lg">
              เรามีบริการที่หลากหลายเพื่อตอบสนองความต้องการดูแลรถมอเตอร์ไซค์ของคุณในทุกระดับ 
              ด้วยผลิตภัณฑ์คุณภาพและทีมงานมืออาชีพ
            </p>
          </div>

          <div className="space-y-12">
            {services.map((service) => (
              <Card key={service.id} variant="elevated" className={`overflow-hidden ${service.popular ? 'border-2 border-[#0056B3]' : ''}`}>
                <div className="flex flex-col md:flex-row">
                  <div className="p-8 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold font-prompt text-[#212529]">{service.title}</h2>
                        {service.popular && (
                          <span className="bg-[#0056B3]/10 text-[#0056B3] px-3 py-1 rounded-full text-xs font-semibold">
                            ยอดนิยม
                          </span>
                        )}
                      </div>
                      <p className="text-[#6C757D] mb-6 text-lg">{service.shortDesc}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="text-[#28A745] mt-1 flex-shrink-0" size={18} />
                            <span className="text-[#212529]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-8 md:w-1/3 border-t md:border-t-0 md:border-l border-[#E5E7EB] flex flex-col justify-center">
                    <h3 className="font-semibold text-[#212529] mb-4 text-center font-prompt">ราคาตามขนาดรถ (บาท)</h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-[#6C757D]">Small ({"<150cc"})</span>
                        <span className="font-semibold text-[#212529]">{service.priceSmall}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-[#6C757D]">Medium (150-400cc)</span>
                        <span className="font-semibold text-[#212529]">{service.priceMedium}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-[#6C757D]">Large ({">400cc"})</span>
                        <span className="font-semibold text-[#212529]">{service.priceLarge}</span>
                      </div>
                    </div>
                    
                    <Link href="/dashboard/bookings/new" className="w-full">
                      <Button variant={service.popular ? "primary" : "outline"} className="w-full">
                        จองบริการนี้
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
