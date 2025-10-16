// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Função de validação de CPF (robusta)
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const router = useRouter();

  // Validação e formatação em tempo real do CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);

    const rawValue = value.replace(/\D/g, '');
    if (rawValue.length === 11 && !validateCPF(rawValue)) {
      setCpfError('CPF inválido.');
    } else {
      setCpfError('');
    }
  };

  // ***** INÍCIO DA CORREÇÃO PRINCIPAL *****
  // Registo com E-mail/Senha usando toast.promise
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCpf = cpf.replace(/[^\d]/g, '');
    if (!validateCPF(rawCpf)) {
      return toast.error('Por favor, insira um CPF válido.');
    }
    setLoading(true);

    const registrationPromise = async () => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        await setDoc(doc(db, "users", user.uid), { name, email, cpf: rawCpf });
    };

    toast.promise(registrationPromise(), {
      loading: 'A criar a sua conta...',
      success: () => {
        setLoading(false);
        router.push('/dashboard'); // Redireciona para o dashboard após o sucesso
        return 'Conta criada! Bem-vindo ao Fintrack.';
      },
      error: (err) => {
        setLoading(false);
        return err.message || 'Erro ao registar. Tente novamente.';
      },
    });
  };

  // Registo com Provedores OAuth usando toast.promise
  const handleOAuthRegister = async (provider: any) => {
    setLoading(true);
    
    const oauthPromise = async () => {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || "",
            email: user.email || "",
            cpf: "" 
        }, { merge: true });
    };

    toast.promise(oauthPromise(), {
        loading: 'A redirecionar...',
        success: () => {
            setLoading(false);
            router.push('/dashboard'); // Redireciona para o dashboard
            return 'Login bem-sucedido!';
        },
        error: (err) => {
            setLoading(false);
            return err.message || 'Erro ao fazer login com provedor.';
        },
    });
  };
  // ***** FIM DA CORREÇÃO PRINCIPAL *****

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Crie a sua Conta</h1>
        <p className="text-center text-gray-500 mb-6">Comece a organizar as suas finanças hoje mesmo.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
          <div>
            <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} required className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 ${cpfError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#C800C8]'}`}/>
            {cpfError && <p className="text-red-500 text-xs mt-1">{cpfError}</p>}
          </div>
          <button type="submit" disabled={loading || !!cpfError} className={`w-full py-3 rounded-lg font-bold bg-[#C800C8] text-black hover:bg-fuchsia-500 transition-colors ${loading || !!cpfError ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </form>
        
        <div className="mt-6">
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div></div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
             <button onClick={() => handleOAuthRegister(googleProvider)} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.434 36.338 48 29.886 48 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Google
            </button>
            <button onClick={() => handleOAuthRegister(githubProvider)} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.795 24 17.3 24 12 24 5.373 18.627 0 12 0z"/></svg>
                GitHub
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-[#C800C8] hover:underline">
                    Faça Login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}