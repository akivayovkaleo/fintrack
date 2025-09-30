// src/app/login/page.tsx

'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Github, Mail } from 'lucide-react';

// Importações do Firebase e do nosso contexto
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Função de Login com E-mail e Senha
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Por favor, preencha todos os campos.');
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('E-mail ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função de Login com Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Login com Google realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Não foi possível fazer login com o Google.');
    } finally {
      setLoading(false);
    }
  };

  // Função de Login com GitHub
  const handleGithubLogin = async () => {
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Login com GitHub realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Não foi possível fazer login com o GitHub.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função de Recuperação de Senha
  const handlePasswordReset = () => {
    if (!email) {
      return toast.error('Por favor, digite seu e-mail para recuperar a senha.');
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Não foi possível enviar o e-mail de recuperação.');
      });
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Acesse sua Conta</h2>
        
        {/* Formulário de Login */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <div className="text-sm text-right">
            <button type="button" onClick={handlePasswordReset} className="font-medium text-primary hover:underline">
              Esqueceu a senha?
            </button>
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continue com</span>
          </div>
        </div>

        {/* Botões de Login Social (OAuth) */}
        <div className="grid grid-cols-1 gap-4">
           <button onClick={handleGoogleLogin} disabled={loading} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">
            <Mail className="w-5 h-5 mr-2" />
            Entrar com Google
          </button>
          <button onClick={handleGithubLogin} disabled={loading} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">
            <Github className="w-5 h-5 mr-2" />
            Entrar com GitHub
          </button>
        </div>

        <p className="text-sm text-center text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}