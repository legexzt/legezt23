import Link from "next/link";

export default function LegeztTubePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-4xl font-bold text-[#00ffe7] gap-8">
      <div>Welcome to LegeztTube</div>
      <Link href="/" className="text-base bg-[#00ffe7] text-[#181818] px-4 py-2 rounded-lg shadow hover:bg-[#00ff99] transition">← Back to Home</Link>
    </div>
  );
}
