'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#C800C8] px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-[#C800C8] mb-4">FinTrack</h1>
        <p className="text-lg text-black mb-6">
          Sua plataforma inteligente de gestão financeira pessoal.
        </p>
        <div className="flex flex-col gap-4 mt-6">
          <Link
            href="/register"
            className="w-full px-6 py-3 rounded-md bg-[#C800C8] text-white font-bold text-lg hover:bg-[#A000A0] transition"
          >
            Começar Gratuitamente
          </Link>
          <Link
            href="/login"
            className="w-full px-6 py-3 rounded-md border-2 border-[#C800C8] text-[#C800C8] font-bold text-lg hover:bg-[#C800C8] hover:text-white transition"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </main>
  );
}