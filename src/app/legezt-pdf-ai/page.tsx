import Link from "next/link";

export default function LegeztPDFAIPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-4xl font-bold text-[#00bfff] gap-8">
      <div>Welcome to Legezt PDF AI</div>
      <Link href="/" className="text-base bg-[#00bfff] text-[#181818] px-4 py-2 rounded-lg shadow hover:bg-[#00ffe7] transition">← Back to Home</Link>
    </div>
  );
}
