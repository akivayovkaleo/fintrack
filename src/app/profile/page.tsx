// src/app/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redireciona se o utilizador não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Preenche o campo de nome com o nome atual do utilizador
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim()) {
      toast.error('O nome não pode ficar em branco.');
      return;
    }
    
    // Evita a chamada à API se nada mudou
    if (name === user.displayName) {
        toast('Nenhuma alteração para salvar.', { icon: 'ℹ️' });
        return;
    }

    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error('Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  // Ecrã de carregamento
  if (authLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
            <p className="text-gray-500">A carregar perfil...</p>
        </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Meu Perfil</h1>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome de Exibição</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C800C8]"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold bg-[#C800C8] text-black hover:bg-fuchsia-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? 'A salvar...' : 'Salvar Alterações'}
            </button>
        </form>
      </div>
    </div>
  );
}