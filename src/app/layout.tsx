// src/app/layout.tsx
'use client'; 

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, Landmark, User, LogOut, Menu, X } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

// Componente do Cabeçalho Unificado e Responsivo
const AppHeader = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  const navLinks = user ? (
    // Links para UTILIZADOR LOGADO
    <>
      <Link href="/dashboard" className="flex items-center gap-3 text-lg md:text-sm py-2 md:py-0"><LayoutDashboard size={16} /> Dashboard</Link>
      <Link href="/transactions" className="flex items-center gap-3 text-lg md:text-sm py-2 md:py-0"><Landmark size={16} /> Transações</Link>
      <Link href="/profile" className="flex items-center gap-3 text-lg md:text-sm py-2 md:py-0"><User size={16} /> Perfil</Link>
    </>
  ) : (
    // Links para VISITANTES
    <>
      <a href="/#recursos" className="text-lg md:text-sm py-2 md:py-0">Recursos</a>
      <a href="/#depoimentos" className="text-lg md:text-sm py-2 md:py-0">Depoimentos</a>
    </>
  );

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-3xl font-extrabold text-[#C800C8] tracking-tight">
          FINTRACK
        </Link>
        
        {/* Links do Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks}
        </div>
        
        {/* Botões do Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors">
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2 border border-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors">Login</Link>
              <Link href="/register" className="bg-[#C800C8] text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-fuchsia-500 transition-colors">Começar Agora</Link>
            </>
          )}
        </div>
        
        {/* Botão do Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Painel do Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-black absolute w-full left-0 flex flex-col items-center space-y-6 py-8 border-t border-gray-700">
          {navLinks}
          <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center space-y-4 px-6">
            {user ? (
                <button onClick={handleLogout} className="w-full text-center flex items-center justify-center gap-2 px-4 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-black transition-colors">
                  <LogOut size={16} /> Sair
                </button>
            ) : (
              <>
                <Link href="/login" className="w-full text-center px-5 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-black transition-colors">Login</Link>
                <Link href="/register" className="w-full text-center bg-[#C800C8] text-black px-5 py-3 rounded-full font-bold hover:bg-fuchsia-500 transition-colors">Começar Agora</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Rodapé (sem alterações)
const Footer = () => (
    <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                    <div className="text-3xl font-extrabold text-[#C800C8] tracking-tight">FINTRACK</div>
                    <p className="text-sm mt-2 text-gray-400">© 2024 Fintrack. Todos os direitos reservados.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="text-sm hover:text-[#C800C8] transition-colors">Privacidade</a>
                    <a href="#" className="text-sm hover:text-[#C800C8] transition-colors">Termos</a>
                    <a href="#" className="text-sm hover:text-[#C800C8] transition-colors">Contacto</a>
                </div>
            </div>
        </div>
    </footer>
);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white min-h-screen`}>
        <AuthProvider>
          <AppHeader />
          <main>{children}</main>
          {pathname === '/' && <Footer />}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}