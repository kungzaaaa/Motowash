"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, PlusCircle, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function VehiclesPage() {
  const vehicles = [
    { id: 1, brand: "Honda", model: "PCX 160", plate: "1กข 1234", province: "กรุงเทพมหานคร", type: "Medium", typeDetail: "150-400cc" },
    { id: 2, brand: "Yamaha", model: "XMAX 300", plate: "2ขค 5678", province: "เชียงใหม่", type: "Medium", typeDetail: "150-400cc" },
    { id: 3, brand: "Honda", model: "Wave 110i", plate: "3คง 9012", province: "นนทบุรี", type: "Small", typeDetail: "<150cc" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-prompt text-[#212529]">รถของฉัน</h1>
          <p className="text-[#6C757D]">จัดการข้อมูลรถมอเตอร์ไซค์ของคุณเพื่อความรวดเร็วในการจอง</p>
        </div>
        <Button variant="primary" icon={<PlusCircle size={18} />}>
          เพิ่มรถคันใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <Card key={v.id} className="relative overflow-hidden group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 bg-white shadow-sm rounded-md text-gray-500 hover:text-[#0056B3] border border-gray-100">
                <Edit2 size={16} />
              </button>
              <button className="p-1.5 bg-white shadow-sm rounded-md text-gray-500 hover:text-[#DC3545] border border-gray-100">
                <Trash2 size={16} />
              </button>
            </div>
            
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0056B3] mb-4">
                <Car size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-[#212529] mb-1">{v.brand} {v.model}</h3>
              
              <div className="inline-block border-2 border-gray-300 rounded-md overflow-hidden mb-4 bg-white font-mono text-center shadow-sm">
                <div className="px-3 py-1 font-bold text-lg border-b border-gray-200">{v.plate}</div>
                <div className="px-3 py-0.5 text-xs text-gray-600 bg-gray-50">{v.province}</div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <span className="text-sm text-[#6C757D]">ประเภทขนาดรถ</span>
                <Badge variant="neutral">
                  {v.type} <span className="font-normal opacity-70 ml-1">({v.typeDetail})</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-[#0056B3]/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-6 min-h-[280px]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
            <PlusCircle size={32} />
          </div>
          <h3 className="font-semibold text-lg text-[#212529] mb-1 font-prompt">เพิ่มรถมอเตอร์ไซค์</h3>
          <p className="text-[#6C757D] text-sm max-w-[200px]">เพิ่มข้อมูลรถของคุณเพื่อความสะดวกในการเรียกใช้บริการ</p>
        </Card>
      </div>
    </div>
  );
}
