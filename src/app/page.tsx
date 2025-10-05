// src/app/page.tsx
'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Seção Hero */}
      <section id="hero" className="bg-white">
        <div className="container mx-auto px-6 py-32 text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900">
            Controle total da sua <span className="text-[#C800C8]">vida financeira</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl">
            Organize os seus gastos, poupe dinheiro e alcance os seus objetivos financeiros com o Fintrack.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-[#C800C8] text-black font-bold py-4 px-8 rounded-full text-center hover:bg-fuchsia-500 transition-colors shadow-lg">
              Começar Gratuitamente
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Recursos */}
      <section id="recursos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
            Recursos que o vão ajudar a <span className="text-[#C800C8]">controlar as suas finanças</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cards de Recursos... */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#C800C8] text-white">
                <svg xmlns="http://www.w.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Planeamento Financeiro</h3>
              <p className="text-gray-600">Crie um plano financeiro personalizado e acompanhe o seu progresso.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#C800C8] text-white">
                <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle de Gastos</h3>
              <p className="text-gray-600">Registe e categorize os seus gastos diários para uma visão clara.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#C800C8] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios Detalhados</h3>
              <p className="text-gray-600">Receba relatórios mensais e descubra onde pode poupar mais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
            O que os nossos <span className="text-[#C800C8]">clientes dizem</span>
          </h2>
          {/* Depoimentos... */}
        </div>
      </section>
    </>
  );
}