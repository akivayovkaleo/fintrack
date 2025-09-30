// src/app/page.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart2, DollarSign, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="text-gray-800">
      {/* Seção Principal (Hero) */}
      <section className="text-center py-20 px-4 bg-gray-50 rounded-lg">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Assuma o Controle da Sua Vida Financeira
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Fintrack é a ferramenta definitiva para você organizar suas despesas, visualizar seus gastos e alcançar suas metas financeiras com facilidade.
        </p>
        <div className="flex justify-center items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Ir para o Dashboard
            </Link>
          ) : (
            <>
              <Link href="/register" className="btn-primary">
                Começar Gratuitamente
              </Link>
              <Link href="/login" className="font-medium text-gray-700 hover:text-primary transition-colors">
                Já tenho conta
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tudo o que você precisa em um só lugar
        </h2>
        <div className="grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Controle Total</h3>
            <p className="text-gray-600">
              Registre suas receitas e despesas de forma rápida e veja para onde seu dinheiro está indo.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gráficos Intuitivos</h3>
            <p className="text-gray-600">
              Visualize seus dados financeiros com gráficos simples de entender e tome decisões mais inteligentes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Segurança em Primeiro Lugar</h3>
            <p className="text-gray-600">
              Seus dados são protegidos com a segurança de ponta do Firebase, garantindo sua privacidade.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de CTA Final */}
      <section className="text-center py-20 px-4 bg-primary text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar sua jornada financeira?</h2>
        <p className="text-lg mb-8">Crie sua conta gratuita hoje mesmo e transforme sua relação com o dinheiro.</p>
        <Link href="/register" className="bg-white text-primary font-bold px-8 py-3 rounded-lg transition-transform hover:scale-105">
          Cadastre-se Agora
        </Link>
      </section>
    </div>
  );
}