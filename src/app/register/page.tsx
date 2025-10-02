// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import db from '@/lib/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  // Validação de CPF (simples)
  const validateCPF = (cpf: string): boolean => {
    if (!cpf) return false;
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCPF(cpf)) {
      toast.error('CPF inválido');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        cpf
      });

      toast.success('Conta criada! Verifique seu e-mail para ativar sua conta.');
      window.location.href = '/'; // Redireciona para a landing page
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: any) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "",
        email: user.email || "",
        cpf: ""
      });
      toast.success('Conta criada com sucesso!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Já existe uma conta com este e-mail usando outro método de login. Por favor, faça login com o provedor correto."
        );
      } else {
        toast.error(error.message || 'Erro ao cadastrar com provedor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-pink-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-pink-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-pink-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-black"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-black">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              required
              className="w-full px-3 py-2 border border-pink-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-bold bg-pink-600 text-white hover:bg-pink-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-pink-600 hover:underline">
            Já tenho conta
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
              type="button"
              onClick={() => handleOAuthRegister(googleProvider)}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-white text-pink-600 font-semibold hover:bg-pink-50 border border-pink-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Cadastrar com Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthRegister(githubProvider)}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-white text-pink-600 font-semibold hover:bg-pink-50 border border-pink-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5" />
              Cadastrar com GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}