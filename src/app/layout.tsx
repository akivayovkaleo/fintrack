import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


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
      {/* MODIFICAÇÃO APLICADA AQUI:
        Adicionamos as classes `bg-background-primary` e `text-text-primary`
        para que o tema escuro seja o padrão em toda a aplicação.
      */}
      <body className={`${inter.className} bg-background-primary text-text-primary`}>
        <AuthProvider>
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