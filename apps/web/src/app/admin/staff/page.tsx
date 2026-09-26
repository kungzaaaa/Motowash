import { Search, Plus, Star, Phone, MapPin, Briefcase } from 'lucide-react';

export default function StaffPage() {
  const staffList = [
    { id: 'EMP-001', name: 'ช่างเอก สมบูรณ์', status: 'Available', jobsToday: 2, totalJobs: 145, rating: 4.8, phone: '081-111-1111' },
    { id: 'EMP-002', name: 'ช่างบอย ขยัน', status: 'Busy', jobsToday: 4, totalJobs: 210, rating: 4.9, phone: '082-222-2222' },
    { id: 'EMP-003', name: 'ช่างชัย ใจดี', status: 'Off-duty', jobsToday: 0, totalJobs: 89, rating: 4.5, phone: '083-333-3333' },
    { id: 'EMP-004', name: 'ช่างเด่น มอเตอร์', status: 'Available', jobsToday: 1, totalJobs: 56, rating: 4.7, phone: '084-444-4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">จัดการพนักงาน</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>เพิ่มพนักงาน</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">พนักงานทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">12 คน</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">พร้อมรับงาน</p>
            <p className="text-2xl font-bold text-green-600">5 คน</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">กำลังให้บริการ</p>
            <p className="text-2xl font-bold text-orange-600">4 คน</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <ClockIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อพนักงาน..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>สถานะทั้งหมด</option>
          <option>Available</option>
          <option>Busy</option>
          <option>Off-duty</option>
        </select>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{staff.name}</h3>
                  <p className="text-xs text-gray-500">{staff.id}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border
                ${staff.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 
                  staff.status === 'Busy' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                  'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {staff.status === 'Available' ? 'พร้อมรับงาน' : staff.status === 'Busy' ? 'ติดงาน' : 'ออกเวร'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{staff.rating} (เรตติ้งเฉลี่ย)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t pt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">งานวันนี้</p>
                <p className="font-bold text-gray-900">{staff.jobsToday}</p>
              </div>
              <div className="text-center border-l">
                <p className="text-xs text-gray-500">งานทั้งหมด</p>
                <p className="font-bold text-gray-900">{staff.totalJobs}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button className="w-full text-center text-sm text-blue-600 font-medium hover:underline">
                ดูรายละเอียด / ประวัติงาน
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
