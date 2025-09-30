// src/app/transactions/page.tsx

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { toast } from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Tipagem para os dados do formulário
type FormData = Omit<Transaction, 'id' | 'userId' | 'date'> & { date: string };

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { transactions, loading: transactionsLoading, addTransaction } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<FormData>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0], // Data de hoje no formato YYYY-MM-DD
    category: '',
    type: 'expense',
    status: 'pending',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protege a rota
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };
  
  const resetForm = () => {
    setFormState({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: 'expense',
      status: 'pending',
    });
  };
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.description || formState.amount <= 0 || !formState.category) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Prepara os dados para enviar ao Firestore
      const transactionData = {
        description: formState.description,
        amount: formState.amount,
        date: Timestamp.fromDate(new Date(formState.date)), // Converte a string de data para Timestamp
        category: formState.category,
        type: formState.type,
        ...(formState.type === 'expense' && { status: formState.status }), // Adiciona status apenas se for despesa
      };

      await addTransaction(transactionData);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao submeter transação:", error);
      toast.error("Não foi possível adicionar a transação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || transactionsLoading) {
    return <div className="text-center mt-10">Carregando transações...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suas Transações</h1>
        <button onClick={handleOpenModal} className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Nova Transação
        </button>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold">Valor</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="p-4">{t.description}</td>
                  <td className={`p-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-4">{t.category}</td>
                  <td className="p-4">{t.date.toDate().toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                    {t.type === 'expense' && (
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                         {t.status === 'paid' ? 'Pago' : 'Pendente'}
                       </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="text-gray-500 hover:text-blue-600"><Edit size={18} /></button>
                    <button className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Adicionar Nova Transação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos do formulário... */}
              <div>
                <label>Descrição</label>
                <input type="text" name="description" value={formState.description} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required/>
              </div>
              <div>
                <label>Valor</label>
                <input type="number" name="amount" value={formState.amount} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required/>
              </div>
              <div>
                <label>Data</label>
                <input type="date" name="date" value={formState.date} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required/>
              </div>
               <div>
                <label>Categoria</label>
                <input type="text" name="category" value={formState.category} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" required/>
              </div>
              <div>
                <label>Tipo</label>
                <select name="type" value={formState.type} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded">
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
              {formState.type === 'expense' && (
                <div>
                  <label>Status</label>
                  <select name="status" value={formState.status} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded">
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}