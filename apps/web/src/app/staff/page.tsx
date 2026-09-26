import Link from 'next/link';
import { MapPin, Clock, Car } from 'lucide-react';

const mockJobs = [
  {
    id: 'JOB-1001',
    customerName: 'คุณสมชาย ใจดี',
    vehicle: 'Honda PCX 160',
    service: 'ล้างพรีเมียม + เคลือบเงา',
    location: 'สุขุมวิท 71, กรุงเทพมหานคร',
    status: 'รอดำเนินการ',
    time: '10:00 น.',
  },
  {
    id: 'JOB-1002',
    customerName: 'คุณสมหญิง สวยงาม',
    vehicle: 'Yamaha XMAX 300',
    service: 'ล้างมาตรฐาน',
    location: 'เอกมัย, กรุงเทพมหานคร',
    status: 'กำลังเดินทาง',
    time: '13:00 น.',
  },
];

export default function StaffDashboard() {
  return (
    <div className="p-4 space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">งานของวันนี้</h1>
        <p className="text-gray-500">คุณมี {mockJobs.length} งานที่ต้องทำในวันนี้</p>
      </header>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {job.status}
                </span>
                <h3 className="font-bold text-gray-900 mt-2">{job.customerName}</h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-600">{job.time}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>{job.vehicle} ({job.service})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>

            <Link 
              href={`/staff/jobs/${job.id}`}
              className="block w-full text-center bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ดูรายละเอียด
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
