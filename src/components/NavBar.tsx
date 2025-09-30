// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

export default function Navbar() {
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
    <>
      <nav className="navbar-menu border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="navbar-logo">FinTrack</Link>
          <div className="hidden md:flex navbar-links">
            <Link href="/#features" className="hover:text-primary">Funcionalidades</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
                <Link href="/transactions" className="hover:text-primary">Transações</Link>
                <Link href="/profile" className="hover:text-primary">Perfil</Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary">Cadastrar</Link>
              </>
            )}
          </div>
          <button
            className="navbar-mobile-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden bg-bg-secondary p-4">
            <Link href="/#features" className="block py-2 hover:text-primary">Funcionalidades</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-primary">Dashboard</Link>
                <Link href="/transactions" className="block py-2 hover:text-primary">Transações</Link>
                <Link href="/profile" className="block py-2 hover:text-primary">Perfil</Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary block mt-2 w-full text-center"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1 py-2 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary block mt-2">Cadastrar</Link>
              </>
            )}
          </div>
        )}
      </nav>
      <Toaster />
    </>
  );
}
