// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importa o useRouter

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Instancia o router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login bem-sucedido!');
      router.push('/dashboard'); // Redirecionamento otimizado
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
      router.push('/dashboard'); // Redirecionamento otimizado
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Já existe uma conta com este e-mail usando outro método de login."
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
      return toast.error('Por favor, insira o seu e-mail no campo acima para redefinir a senha.');
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de recuperação enviado! Verifique a sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Acesse a sua Conta</h1>
        <p className="text-center text-gray-500 mb-6">Continue a organizar as suas finanças.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold bg-[#C800C8] text-black hover:bg-fuchsia-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="text-sm text-gray-600 hover:text-[#C800C8] hover:underline"
          >
            Esqueceu a sua senha?
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou continue com</span></div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
             <button onClick={() => handleOAuthLogin(googleProvider)} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                Google
            </button>
            <button onClick={() => handleOAuthLogin(githubProvider)} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5" />
                GitHub
            </button>
          </div>
        </div>

         <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/register" className="font-semibold text-[#C800C8] hover:underline">
                    Registe-se
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}