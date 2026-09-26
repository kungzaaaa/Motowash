import { Search, Filter, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';

export default function BookingsPage() {
  const bookings = Array(8).fill(null).map((_, i) => ({
    id: `BK-${2000 + i}`,
    date: '2024-05-20',
    time: `${10 + i}:00`,
    customer: `ลูกค้าคนที่ ${i + 1}`,
    service: 'ล้างมาตรฐาน',
    staff: i % 3 === 0 ? 'รอจัดสรร' : 'ช่างเอ',
    status: i % 4 === 0 ? 'เสร็จสิ้น' : i % 3 === 0 ? 'รอดำเนินการ' : 'ยืนยันแล้ว',
    total: '250',
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">จัดการการจอง</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          + เพิ่มการจองใหม่
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อลูกค้า, รหัสการจอง..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>สถานะทั้งหมด</option>
          <option>รอดำเนินการ</option>
          <option>ยืนยันแล้ว</option>
          <option>เสร็จสิ้น</option>
          <option>ยกเลิก</option>
        </select>
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>วันที่ทั้งหมด</option>
          <option>วันนี้</option>
          <option>พรุ่งนี้</option>
          <option>สัปดาห์นี้</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">รหัส/วันที่</th>
                <th className="px-6 py-4 font-medium">ลูกค้า</th>
                <th className="px-6 py-4 font-medium">บริการ/ราคา</th>
                <th className="px-6 py-4 font-medium">พนักงาน</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{b.id}</div>
                    <div className="text-gray-500 text-xs">{b.date} {b.time}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{b.customer}</td>
                  <td className="px-6 py-4">
                    <div>{b.service}</div>
                    <div className="text-gray-500 text-xs">฿{b.total}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${b.staff === 'รอจัดสรร' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {b.staff}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${b.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' : 
                        b.status === 'รอดำเนินการ' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="ดูรายละเอียด"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-orange-600" title="แก้ไข"><Edit className="w-4 h-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-red-600" title="ยกเลิก"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
