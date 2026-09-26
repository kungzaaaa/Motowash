import { DollarSign, ShoppingBag, Users, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { title: 'การจองวันนี้', value: '24', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'กำลังให้บริการ', value: '5', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'งานเสร็จสิ้น', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'รายได้โดยประมาณ', value: '฿8,450', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'พนักงานออนไลน์', value: '8/10', icon: Users, color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

  const recentBookings = [
    { id: 'BK-1001', customer: 'คุณสมชาย ใจดี', service: 'ล้างพรีเมียม', staff: 'ช่างเอก', status: 'เสร็จสิ้น', time: '10:00' },
    { id: 'BK-1002', customer: 'คุณสมหญิง สวยงาม', service: 'ล้างมาตรฐาน', staff: 'ช่างบอย', status: 'กำลังให้บริการ', time: '13:00' },
    { id: 'BK-1003', customer: 'คุณวินัย รักรถ', service: 'ขัดเคลือบสี', staff: 'รอจัดสรร', status: 'รอดำเนินการ', time: '15:00' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ภาพรวมระบบ (Dashboard)</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">การจองล่าสุด</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">ดูทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium">รหัส</th>
                <th className="px-4 py-3 font-medium">ลูกค้า</th>
                <th className="px-4 py-3 font-medium">บริการ</th>
                <th className="px-4 py-3 font-medium">พนักงาน</th>
                <th className="px-4 py-3 font-medium">เวลา</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{booking.id}</td>
                  <td className="px-4 py-3">{booking.customer}</td>
                  <td className="px-4 py-3">{booking.service}</td>
                  <td className="px-4 py-3">{booking.staff}</td>
                  <td className="px-4 py-3">{booking.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${booking.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'กำลังให้บริการ' ? 'bg-orange-100 text-orange-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                    </span>
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
