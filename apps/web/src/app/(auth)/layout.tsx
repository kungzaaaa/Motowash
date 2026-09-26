export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0056B3]/10 to-[#17A2B8]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-3xl">🏍️</span>
            <span className="text-2xl font-bold font-prompt text-[#0056B3]">MotoWash</span>
          </div>
          <p className="text-[#6C757D]">แพลตฟอร์มบริการล้างรถมอเตอร์ไซค์ถึงที่</p>
        </div>
        {children}
      </div>
    </div>
  );
}
