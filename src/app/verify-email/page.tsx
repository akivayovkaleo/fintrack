// src/app/verify-email/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o utilizador chegar aqui e o e-mail já estiver verificado, redireciona
    if (user && user.emailVerified) {
      toast.success('E-mail verificado com sucesso!');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        toast.success('Um novo e-mail de verificação foi enviado!');
      } catch (error) {
        toast.error('Erro ao reenviar o e-mail. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifique o seu E-mail</h1>
        <p className="mb-6 text-gray-600">
          Enviámos um link de ativação para <strong className="text-[#C800C8]">{user?.email}</strong>. Por favor, clique no link para ativar a sua conta.
        </p>
        <div className="space-y-4">
            <button
            className="w-full py-3 rounded-lg font-bold bg-[#C800C8] text-black hover:bg-fuchsia-500 transition-colors"
            onClick={() => window.location.reload()}
            >
            Já verifiquei, atualizar página
            </button>
            <button
            className="w-full text-sm text-gray-600 hover:text-[#C800C8] hover:underline"
            onClick={handleResendVerification}
            >
            Não recebeu? Reenviar e-mail
            </button>
        </div>
      </div>
    </div>
  );
}