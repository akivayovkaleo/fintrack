// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack - Sua Plataforma Inteligente de Gestão Financeira Pessoal",
  description: "Controle suas receitas e despesas com simplicidade e inteligência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#C800C8] min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex flex-col items-center justify-center min-h-[80vh] w-full">
            {children}
          </main>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}