import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, Clock, CreditCard, Loader2, MapPin, 
  UserSquare2, Car, Search, Droplets, Sparkles, 
  CheckSquare, Check, XCircle, AlertCircle, CircleDollarSign
} from "lucide-react"

export enum BookingStatus {
  BOOKING_CREATED = "BOOKING_CREATED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  WAITING_FOR_SERVICE = "WAITING_FOR_SERVICE",
  STAFF_ASSIGNED = "STAFF_ASSIGNED",
  STAFF_ON_THE_WAY = "STAFF_ON_THE_WAY",
  ARRIVED = "ARRIVED",
  VEHICLE_RECEIVED = "VEHICLE_RECEIVED",
  VEHICLE_INSPECTION = "VEHICLE_INSPECTION",
  WASHING = "WASHING",
  DETAILING = "DETAILING",
  FINAL_INSPECTION = "FINAL_INSPECTION",
  WAITING_FOR_CUSTOMER_CONFIRMATION = "WAITING_FOR_CUSTOMER_CONFIRMATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ISSUE_REPORTED = "ISSUE_REPORTED",
  PAYMENT_REMAINING = "PAYMENT_REMAINING",
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  color: string;
  description: string;
}

const statusMap: Record<BookingStatus, StatusConfig> = {
  [BookingStatus.BOOKING_CREATED]: { icon: <CheckCircle2 size={16} />, label: "จองสำเร็จ", color: "text-[#28A745]", description: "ระบบได้รับคำสั่งซื้อของคุณแล้ว" },
  [BookingStatus.PAYMENT_PENDING]: { icon: <Clock size={16} />, label: "รอชำระเงิน", color: "text-[#FFC107]", description: "กรุณาชำระเงินเพื่อยืนยันการจอง" },
  [BookingStatus.PAYMENT_CONFIRMED]: { icon: <CreditCard size={16} />, label: "ชำระเงินแล้ว", color: "text-[#28A745]", description: "การชำระเงินได้รับการยืนยัน" },
  [BookingStatus.WAITING_FOR_SERVICE]: { icon: <Clock size={16} />, label: "รอถึงคิว", color: "text-[#17A2B8]", description: "กำลังรอถึงคิวบริการ" },
  [BookingStatus.STAFF_ASSIGNED]: { icon: <UserSquare2 size={16} />, label: "มีพนักงานรับผิดชอบ", color: "text-[#0056B3]", description: "จัดสรรพนักงานเรียบร้อยแล้ว" },
  [BookingStatus.STAFF_ON_THE_WAY]: { icon: <MapPin size={16} />, label: "พนักงานกำลังเดินทาง", color: "text-[#0056B3]", description: "พนักงานกำลังเดินทางไปยังสถานที่ของคุณ" },
  [BookingStatus.ARRIVED]: { icon: <MapPin size={16} />, label: "พนักงานถึงสถานที่", color: "text-[#0056B3]", description: "พนักงานเดินทางถึงจุดหมายแล้ว" },
  [BookingStatus.VEHICLE_RECEIVED]: { icon: <Car size={16} />, label: "รับรถแล้ว", color: "text-[#0056B3]", description: "พนักงานรับรถเพื่อเตรียมพร้อม" },
  [BookingStatus.VEHICLE_INSPECTION]: { icon: <Search size={16} />, label: "กำลังตรวจสอบรถ", color: "text-[#0056B3]", description: "พนักงานกำลังประเมินสภาพรถ" },
  [BookingStatus.WASHING]: { icon: <Droplets size={16} />, label: "กำลังล้างรถ", color: "text-[#0056B3]", description: "กำลังดำเนินการล้างรถ" },
  [BookingStatus.DETAILING]: { icon: <Sparkles size={16} />, label: "เก็บรายละเอียด", color: "text-[#0056B3]", description: "พนักงานกำลังทำความสะอาดและเคลือบเงา" },
  [BookingStatus.FINAL_INSPECTION]: { icon: <CheckSquare size={16} />, label: "ตรวจสอบขั้นสุดท้าย", color: "text-[#0056B3]", description: "ตรวจสอบความเรียบร้อยก่อนส่งมอบ" },
  [BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION]: { icon: <Clock size={16} />, label: "รอลูกค้าตรวจรับ", color: "text-[#F0A500]", description: "กรุณาตรวจสอบและยืนยันการรับรถ" },
  [BookingStatus.COMPLETED]: { icon: <Check size={16} />, label: "เสร็จสมบูรณ์", color: "text-[#28A745]", description: "บริการเสร็จสิ้นสมบูรณ์" },
  [BookingStatus.CANCELLED]: { icon: <XCircle size={16} />, label: "ยกเลิก", color: "text-[#DC3545]", description: "คำสั่งซื้อถูกยกเลิก" },
  [BookingStatus.ISSUE_REPORTED]: { icon: <AlertCircle size={16} />, label: "พบปัญหา", color: "text-[#DC3545]", description: "มีการรายงานปัญหาระหว่างการบริการ" },
  [BookingStatus.PAYMENT_REMAINING]: { icon: <CircleDollarSign size={16} />, label: "รอชำระยอดคงเหลือ", color: "text-[#FFC107]", description: "กรุณาชำระยอดเงินส่วนที่เหลือ" },
}

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: BookingStatus;
  showDescription?: boolean;
}

export function StatusIndicator({ status, showDescription = false, className, ...props }: StatusIndicatorProps) {
  const config = statusMap[status];
  
  if (!config) return null;

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <span className={cn("flex items-center justify-center p-1.5 rounded-full bg-opacity-10", config.color.replace('text-', 'bg-'))}>
        <span className={config.color}>{config.icon}</span>
      </span>
      <div className="flex flex-col">
        <span className={cn("text-sm font-semibold", config.color)}>{config.label}</span>
        {showDescription && (
          <span className="text-xs text-[#6C757D]">{config.description}</span>
        )}
      </div>
    </div>
  )
}
