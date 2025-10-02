// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login bem-sucedido!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: any) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success('Login bem-sucedido!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Já existe uma conta com este e-mail usando outro método de login. Por favor, faça login com o provedor correto."
        );
      } else {
        toast.error(error.message || 'Erro ao fazer login com provedor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Por favor, insira seu e-mail');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de recuperação enviado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-600">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Acesse sua conta</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-pink-600 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-pink-600 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold bg-pink-600 text-white hover:bg-pink-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4 flex flex-col gap-2 items-center">
          <button
            onClick={handleResetPassword}
            className="text-sm text-pink-600 hover:underline"
          >
            Esqueci minha senha
          </button>
          <Link href="/register" className="text-sm text-pink-600 hover:underline">
            Criar conta
          </Link>
        </div>
        <div className="mt-6">
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-pink-200"></div>
            <span className="mx-4 text-sm text-pink-600">ou</span>
            <div className="flex-grow border-t border-pink-200"></div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleOAuthLogin(googleProvider)}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-white text-pink-600 font-semibold hover:bg-pink-50 border border-pink-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Entrar com Google
            </button>
            <button
              onClick={() => handleOAuthLogin(githubProvider)}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-white text-pink-600 font-semibold hover:bg-pink-50 border border-pink-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5" />
              Entrar com GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}