// src/app/profile/page.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protege a rota: se não houver usuário após o carregamento, redireciona para o login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Preenche o campo de nome com o nome atual do usuário quando os dados carregam
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!displayName.trim()) {
      toast.error('O nome não pode ficar em branco.');
      return;
    }
    
    if (displayName === user.displayName) {
        toast('Nenhuma alteração para salvar.', { icon: 'ℹ️' });
        return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error('Não foi possível atualizar o perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-600">
        <div className="text-white text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-600">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Acesso restrito</h2>
          <p className="mb-4 text-black">Você precisa estar logado para acessar o perfil.</p>
          <Link href="/login" className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">Meu Perfil</h1>
        <div className="mb-4 text-black">
          <strong>Nome:</strong> {user.displayName || 'Não informado'}
        </div>
        <div className="mb-4 text-black">
          <strong>E-mail:</strong> {user.email}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Nome de Exibição
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn-primary w-full md:w-auto disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}