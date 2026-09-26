import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-prompt text-[#212529] mb-4">ตารางราคาบริการ</h1>
            <p className="text-[#6C757D] text-lg">
              ราคามาตรฐานโปร่งใส ไม่มีบวกเพิ่มหน้างาน (ค่าเดินทางคำนวณตามระยะทางจริง)
            </p>
          </div>

          <Card variant="elevated" className="overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0056B3] text-white">
                    <th className="p-4 font-semibold font-prompt whitespace-nowrap">ประเภทบริการ</th>
                    <th className="p-4 font-semibold font-prompt whitespace-nowrap text-center">Small<br/><span className="text-xs font-normal text-blue-100">(&lt;150cc)</span></th>
                    <th className="p-4 font-semibold font-prompt whitespace-nowrap text-center">Medium<br/><span className="text-xs font-normal text-blue-100">(150-400cc)</span></th>
                    <th className="p-4 font-semibold font-prompt whitespace-nowrap text-center">Large<br/><span className="text-xs font-normal text-blue-100">(&gt;400cc)</span></th>
                    <th className="p-4 font-semibold font-prompt whitespace-nowrap text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#212529]">Standard Wash</div>
                      <div className="text-sm text-[#6C757D]">ล้างภายนอก เช็ดแห้ง</div>
                    </td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿150</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿200</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿300</td>
                    <td className="p-4 text-center">
                      <Link href="/dashboard/bookings/new">
                        <Button variant="outline" size="sm">จอง</Button>
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#212529]">Premium Wash</div>
                      <div className="text-sm text-[#6C757D]">ล้าง ลงแว็กซ์ เคลือบเงา</div>
                    </td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿300</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿450</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿600</td>
                    <td className="p-4 text-center">
                      <Link href="/dashboard/bookings/new">
                        <Button variant="primary" size="sm">จอง</Button>
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#212529]">Full Detail</div>
                      <div className="text-sm text-[#6C757D]">ขัดเคลือบสี ดูแลทุกจุด</div>
                    </td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿800</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿1,200</td>
                    <td className="p-4 text-center font-medium text-[#212529]">฿1,800</td>
                    <td className="p-4 text-center">
                      <Link href="/dashboard/bookings/new">
                        <Button variant="outline" size="sm">จอง</Button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="bg-[#17A2B8]/10 border border-[#17A2B8]/20 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-[#17A2B8] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-[#212529] font-prompt">ตัวเลือกการชำระเงินมัดจำ (40%)</h4>
              <p className="text-sm text-[#6C757D] mt-1">
                เพื่อความสะดวกของคุณ คุณสามารถเลือกชำระเงินมัดจำ 40% ของยอดรวมทั้งหมดเมื่อทำการจอง 
                และชำระยอดคงเหลือ 60% เมื่อรับบริการเสร็จสิ้น หรือจะเลือกชำระ 100% เต็มจำนวนเลยก็ได้เช่นกัน
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
