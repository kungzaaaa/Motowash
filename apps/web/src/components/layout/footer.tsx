import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5E7EB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏍️</span>
              <span className="text-xl font-bold font-prompt text-[#0056B3]">MotoWash</span>
            </Link>
            <p className="text-[#6C757D] text-sm max-w-sm">
              บริการล้างรถมอเตอร์ไซค์เดลิเวอรี่ถึงที่ สะดวก รวดเร็ว มั่นใจในคุณภาพ พร้อมให้บริการด้วยทีมงานมืออาชีพ
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#212529] mb-4 font-prompt">เมนูด่วน</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">บริการของเรา</Link></li>
              <li><Link href="/pricing" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">ราคา</Link></li>
              <li><Link href="#" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">เกี่ยวกับเรา</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#212529] mb-4 font-prompt">ช่วยเหลือ</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">ติดต่อเรา</Link></li>
              <li><Link href="#" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">คำถามที่พบบ่อย</Link></li>
              <li><Link href="#" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
              <li><Link href="#" className="text-[#6C757D] hover:text-[#0056B3] text-sm transition-colors">ข้อกำหนดและเงื่อนไข</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#E5E7EB] flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#6C757D]">
            &copy; {currentYear} MotoWash. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-[#6C757D]">
            <span>โทร: 02-XXX-XXXX</span>
            <span>อีเมล: hello@motowash.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
