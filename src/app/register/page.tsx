// src/app/register/page.tsx

'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Importações do Firebase e do nosso contexto
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

// Importação da biblioteca de validação de CPF
import { cpf } from 'cpf-cnpj-validator';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  
  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!name || !email || !password || !cpfValue) {
      return toast.error('Por favor, preencha todos os campos.');
    }
    if (!cpf.isValid(cpfValue)) {
      return toast.error('O CPF informado é inválido.');
    }
    if (password.length < 6) {
        return toast.error('A senha deve ter no mínimo 6 caracteres.');
    }

    setLoading(true);
    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Atualiza o perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // 3. Envia o e-mail de verificação
      await sendEmailVerification(userCredential.user);
      
      toast.success('Cadastro realizado com sucesso! Um e-mail de verificação foi enviado para sua caixa de entrada.');
      
      // Redireciona para a página de login para que o usuário possa entrar após verificar o email
      router.push('/login');

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este e-mail já está em uso.');
      } else {
        toast.error('Ocorreu um erro ao realizar o cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Crie sua Conta</h2>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
           <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              id="cpf"
              type="text"
              value={cpfValue}
              onChange={(e) => setCpfValue(e.target.value)}
              required
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
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
            />
          </div>
          
          <div>
            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}