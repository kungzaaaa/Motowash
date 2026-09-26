import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Car, Clock, CheckCircle } from 'lucide-react';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // Mock data
  const job = {
    id: params.id,
    customerName: 'คุณสมชาย ใจดี',
    phone: '081-234-5678',
    vehicle: 'Honda PCX 160 (สีดำ)',
    plate: '1กข 1234 กทม',
    service: 'ล้างพรีเมียม + เคลือบเงา',
    location: 'คอนโด XYZ สุขุมวิท 71, กรุงเทพมหานคร',
    status: 'รอดำเนินการ',
    time: '10:00 น.',
    price: '350 บาท',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <Link href="/staff" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">รายละเอียดงาน {job.id}</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* Customer Info */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3 text-lg">{job.customerName}</h2>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{job.phone}</p>
                <button className="text-blue-600 font-medium mt-1">โทรหาลูกค้า</button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{job.location}</p>
                <button className="text-blue-600 font-medium mt-1">เปิดแผนที่</button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <p className="font-medium text-gray-900">เวลานัดหมาย: {job.time}</p>
            </div>
          </div>
        </section>

        {/* Vehicle & Service Info */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">ข้อมูลบริการ</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">ยานพาหนะ</span>
              <span className="font-medium">{job.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ทะเบียน</span>
              <span className="font-medium">{job.plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">แพ็กเกจ</span>
              <span className="font-medium text-blue-600">{job.service}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-bold">ยอดที่ต้องชำระ</span>
              <span className="font-bold text-green-600">{job.price}</span>
            </div>
          </div>
        </section>

        {/* Photos Placeholder */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">รูปภาพประกอบ</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm flex-col">
              <span>ก่อนให้บริการ</span>
              <span>+ เพิ่มรูป</span>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm flex-col">
              <span>หลังให้บริการ</span>
              <span>+ เพิ่มรูป</span>
            </div>
          </div>
        </section>

        {/* Checklist Placeholder */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">รายการตรวจเช็ค</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              ตรวจสอบร่องรอยก่อนล้าง
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              เก็บของมีค่าของลูกค้า
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              ลูกค้าตรวจสอบความเรียบร้อย
            </label>
          </div>
        </section>
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 w-full bg-white border-t p-4 flex gap-2">
        <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm">
          เริ่มเดินทาง
        </button>
      </div>
    </div>
  );
}
