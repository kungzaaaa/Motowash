import { Clock, MapPin, User } from 'lucide-react';

export default function LiveBoardPage() {
  const columns = [
    {
      title: 'รอดำเนินการ',
      color: 'bg-gray-100 border-gray-200',
      jobs: [
        { id: 'JOB-001', customer: 'คุณ ก.', vehicle: 'PCX 160', time: '14:00', staff: 'รอจัดสรร' }
      ]
    },
    {
      title: 'กำลังเดินทาง',
      color: 'bg-blue-50 border-blue-200',
      jobs: [
        { id: 'JOB-002', customer: 'คุณ ข.', vehicle: 'Forza 350', time: '13:00', staff: 'ช่างเอก' }
      ]
    },
    {
      title: 'กำลังให้บริการ',
      color: 'bg-orange-50 border-orange-200',
      jobs: [
        { id: 'JOB-003', customer: 'คุณ ค.', vehicle: 'XMAX', time: '12:00', staff: 'ช่างบอย', elapsed: '45 นาที' }
      ]
    },
    {
      title: 'เสร็จสิ้นวันนี้',
      color: 'bg-green-50 border-green-200',
      jobs: [
        { id: 'JOB-004', customer: 'คุณ ง.', vehicle: 'Wave 110i', time: '10:00', staff: 'ช่างชัย' }
      ]
    }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Live Job Board</h1>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500"></span> อัพเดทล่าสุด: ตอนนี้</span>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.title} className={`flex-1 min-w-[280px] rounded-xl border ${col.color} p-4 flex flex-col gap-3 h-full`}>
            <div className="flex justify-between items-center font-bold text-gray-800 mb-2">
              <h2>{col.title}</h2>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">{col.jobs.length}</span>
            </div>

            {col.jobs.map((job) => (
              <div key={job.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between font-bold text-gray-900 mb-2">
                  <span>{job.id}</span>
                  <span className="text-blue-600">{job.time}</span>
                </div>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{job.customer} ({job.vehicle})</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">{job.staff}</span>
                    {job.elapsed && (
                      <span className="flex items-center gap-1 text-orange-600 font-medium text-xs">
                        <Clock className="w-3 h-3" /> {job.elapsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {col.jobs.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-4 border-2 border-dashed border-gray-200 rounded-lg">
                ไม่มีงานในสถานะนี้
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
