// src/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-[#C800C8]">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link href="/" className="font-extrabold text-2xl text-[#C800C8]">FinTrack</Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/#features" className="hover:text-[#C800C8] text-black transition">Funcionalidades</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-[#C800C8] text-black transition">Dashboard</Link>
              <Link href="/transactions" className="hover:text-[#C800C8] text-black transition">Transações</Link>
              <Link href="/profile" className="hover:text-[#C800C8] text-black transition">Perfil</Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1 hover:text-[#C800C8] text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                Entrar
              </Link>
              <Link href="/register" className="ml-2 px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">Cadastrar</Link>
            </>
          )}
        </div>
        <button
          className="md:hidden p-2 rounded text-[#C800C8] hover:bg-[#F3F4F6]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white p-4 border-t border-[#C800C8]">
          <Link href="/#features" className="block py-2 hover:text-[#C800C8] text-black transition">Funcionalidades</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 hover:text-[#C800C8] text-black transition">Dashboard</Link>
              <Link href="/transactions" className="block py-2 hover:text-[#C800C8] text-black transition">Transações</Link>
              <Link href="/profile" className="block py-2 hover:text-[#C800C8] text-black transition">Perfil</Link>
              <button
                onClick={handleLogout}
                className="block mt-2 w-full text-center px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1 py-2 hover:text-[#C800C8] text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                Entrar
              </Link>
              <Link href="/register" className="block mt-2 px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}