import Link from "next/link";

export default function LegeztAIPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-4xl font-bold text-[#ff00cc] gap-8">
      <div>Welcome to Legezt AI</div>
      <Link href="/" className="text-base bg-[#ff00cc] text-[#181818] px-4 py-2 rounded-lg shadow hover:bg-[#00ffe7] transition">← Back to Home</Link>
    </div>
  );
}
