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

  if (authLoading || !user) {
    return <div className="text-center mt-10">Carregando perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            E-mail
          </label>
          <p className="text-lg text-gray-800 mt-1">{user.email}</p>
          <p className="text-xs text-gray-400">O e-mail não pode ser alterado.</p>
        </div>

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
  );
}