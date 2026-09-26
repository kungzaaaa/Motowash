"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate register
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <Card variant="elevated" className="w-full border-none shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">สมัครสมาชิก</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input 
            label="ชื่อ-นามสกุล" 
            type="text" 
            placeholder="สมชาย ใจดี" 
            required 
          />
          <Input 
            label="เบอร์โทรศัพท์" 
            type="tel" 
            placeholder="08X-XXX-XXXX" 
            required 
          />
          <Input 
            label="อีเมล" 
            type="email" 
            placeholder="name@example.com" 
            required 
          />
          <div className="space-y-1">
            <Input 
              label="รหัสผ่าน" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
            <p className="text-xs text-[#6C757D]">รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
          </div>
          <Input 
            label="ยืนยันรหัสผ่าน" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
          
          <div className="flex items-start pt-2">
            <input 
              id="terms" 
              type="checkbox" 
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0056B3] focus:ring-[#0056B3]"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-[#6C757D]">
              ฉันยอมรับ <Link href="#" className="text-[#0056B3] hover:underline">ข้อกำหนดและเงื่อนไข</Link> และ <Link href="#" className="text-[#0056B3] hover:underline">นโยบายความเป็นส่วนตัว</Link>
            </label>
          </div>

          <Button type="submit" className="w-full mt-4" size="lg" loading={loading}>
            ลงทะเบียน
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#6C757D]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="text-[#0056B3] hover:underline font-semibold">
            เข้าสู่ระบบ
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
