import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Camera, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#F8F9FA] to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-prompt text-[#212529] mb-6 tracking-tight">
              บริการล้างรถมอเตอร์ไซค์ถึงที่
            </h1>
            <p className="text-lg md:text-xl text-[#6C757D] mb-10 max-w-2xl mx-auto">
              สะดวกรวดเร็ว ไม่ต้องรอคิวที่ร้าน พร้อมบริการดูแลรถคู่ใจของคุณถึงหน้าบ้านด้วยทีมงานมืออาชีพ
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard/bookings/new">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  จองบริการ
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  ดูบริการทั้งหมด
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-prompt text-[#212529]">ขั้นตอนการรับบริการ</h2>
              <p className="text-[#6C757D] mt-4">4 ขั้นตอนง่ายๆ เพื่อรถมอเตอร์ไซค์ที่เงางาม</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "จองคิว", desc: "เลือกบริการและระบุวัน-เวลาที่คุณสะดวก" },
                { step: "2", title: "พนักงานเดินทาง", desc: "ติดตามสถานะพนักงานแบบเรียลไทม์" },
                { step: "3", title: "ล้างรถ", desc: "พนักงานดูแลรถของคุณด้วยผลิตภัณฑ์พรีเมียม" },
                { step: "4", title: "ติดตามสถานะ", desc: "รับการแจ้งเตือนในทุกขั้นตอนจนกว่าจะเสร็จสิ้น" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0056B3]/10 text-[#0056B3] flex items-center justify-center text-2xl font-bold mb-6 relative">
                    {item.step}
                    {i < 3 && <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>}
                  </div>
                  <h3 className="text-lg font-semibold text-[#212529] mb-2 font-prompt">{item.title}</h3>
                  <p className="text-sm text-[#6C757D]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 bg-[#F8F9FA] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-prompt text-[#212529]">แพ็กเกจบริการ</h2>
              <p className="text-[#6C757D] mt-4">เลือกแพ็กเกจที่เหมาะกับรถของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Standard Wash", price: "เริ่มต้น 150฿", desc: "ล้างทำความสะอาดทั่วไป", popular: false },
                { title: "Premium Wash", price: "เริ่มต้น 300฿", desc: "ล้างสี ดูดฝุ่น ลงแว็กซ์เคลือบเงา", popular: true },
                { title: "Full Detail", price: "เริ่มต้น 800฿", desc: "ล้างทำความสะอาดทุกซอกทุกมุม ขัดเคลือบชุดสี", popular: false },
              ].map((service, i) => (
                <Card key={i} variant="elevated" className={`relative ${service.popular ? 'border-2 border-[#0056B3]' : ''}`}>
                  {service.popular && (
                    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-[#0056B3] text-white px-4 py-1 rounded-full text-xs font-bold">
                      ยอดนิยม
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">{service.title}</CardTitle>
                    <div className="text-center mt-4">
                      <span className="text-3xl font-bold text-[#212529]">{service.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-[#6C757D] mb-6">{service.desc}</p>
                    <Link href="/dashboard/bookings/new" className="block w-full">
                      <Button variant={service.popular ? "primary" : "outline"} className="w-full">
                        เลือกแพ็กเกจ
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-prompt text-[#212529]">ทำไมต้องเลือกเรา</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <MapPin size={32} />, title: "Real-time tracking", desc: "ติดตามสถานะพนักงานแบบเรียลไทม์" },
                { icon: <Camera size={32} />, title: "Before/After photos", desc: "ตรวจสอบภาพก่อนและหลังรับบริการ" },
                { icon: <ShieldCheck size={32} />, title: "Professional staff", desc: "พนักงานผ่านการอบรมอย่างมืออาชีพ" },
                { icon: <CreditCard size={32} />, title: "Secure payment", desc: "ชำระเงินปลอดภัย ผ่านระบบออนไลน์" },
              ].map((feature, i) => (
                <div key={i} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5E7EB] text-[#212529] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#212529] mb-2 font-prompt">{feature.title}</h3>
                  <p className="text-sm text-[#6C757D]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#0056B3] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-prompt text-white mb-6">พร้อมจองแล้วหรือยัง?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              สัมผัสประสบการณ์ล้างรถมอเตอร์ไซค์รูปแบบใหม่ ที่จะทำให้ชีวิตคุณง่ายขึ้น
            </p>
            <Link href="/dashboard/bookings/new">
              <Button size="lg" className="bg-[#F0A500] hover:bg-[#F0A500]/90 text-white border-none px-10 py-6 text-lg">
                จองบริการเลย
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
