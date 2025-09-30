// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importações importantes
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintrack - Seu Gerenciador Financeiro",
  description: "Controle suas finanças de forma simples e eficaz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O AuthProvider envolve toda a aplicação */}
        <AuthProvider>
          {/* O Toaster para exibir notificações */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
            }}
          />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}