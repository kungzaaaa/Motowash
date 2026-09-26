"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Card variant="elevated" className="w-full border-none shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">ลืมรหัสผ่าน?</CardTitle>
        {!submitted && (
          <CardDescription>
            กรุณากรอกอีเมลที่ใช้ลงทะเบียน เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
            <div className="w-16 h-16 bg-[#28A745]/10 text-[#28A745] rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-semibold text-[#212529]">ส่งลิงก์สำเร็จแล้ว</h3>
            <p className="text-sm text-[#6C757D] px-4 mb-6">
              เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องข้อความของคุณ
            </p>
            <Link href="/login" className="w-full">
              <Button className="w-full" variant="outline">
                กลับไปหน้าเข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="อีเมล" 
              type="email" 
              placeholder="name@example.com" 
              required 
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </Button>
            
            <div className="mt-4 text-center">
              <Link href="/login" className="inline-flex items-center text-sm text-[#6C757D] hover:text-[#0056B3] transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
