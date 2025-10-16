// src/app/transactions/page.tsx
'use client';

import { useState, useMemo, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTransactions, Transaction, NewTransaction } from '@/hooks/useTransactions';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { toast } from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

// Tipagem para os dados do formulário
type FormData = Omit<Transaction, 'userId' | 'date' | 'amount'> & { date: string; amount: string | number };

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading: transactionsLoading } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  
  // ***** INÍCIO DA CORREÇÃO PRINCIPAL *****
  const [formData, setFormData] = useState<FormData>({
    id: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], // 'amount' começa como string vazia
    category: '', type: 'expense', status: 'paid',
  });
  // ***** FIM DA CORREÇÃO PRINCIPAL *****

  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
    }
  }, [user, authLoading, router]);

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      const categoryMatch = filterCategory ? t.category.toLowerCase() === filterCategory.toLowerCase() : true;
      const dateMatch = filterDate ? t.date.toDate().toISOString().split('T')[0] === filterDate : true;
      return categoryMatch && dateMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  }, [transactions, filterCategory, filterDate, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    const filtered = transactions.filter(t => {
      const categoryMatch = filterCategory ? t.category.toLowerCase() === filterCategory.toLowerCase() : true;
      const dateMatch = filterDate ? t.date.toDate().toISOString().split('T')[0] === filterDate : true;
      return categoryMatch && dateMatch;
    });
    return Math.ceil(filtered.length / itemsPerPage);
  }, [transactions, filterCategory, filterDate, itemsPerPage]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentTransactionId(null);
    setFormData({
        id: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], // 'amount' começa como string vazia
        category: '', type: 'expense', status: 'paid',
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (transaction: Transaction) => {
    setIsEditing(true);
    setCurrentTransactionId(transaction.id);
    setFormData({ ...transaction, date: transaction.date.toDate().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // ***** INÍCIO DA CORREÇÃO PRINCIPAL *****
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Para o campo 'amount', simplesmente guardamos o valor como string
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // ***** FIM DA CORREÇÃO PRINCIPAL *****

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Você precisa de estar logado.");
    
    const amountAsNumber = parseFloat(String(formData.amount)); // Converte para número aqui
    if (isNaN(amountAsNumber) || amountAsNumber <= 0) {
        return toast.error("O valor deve ser um número maior que zero.");
    }

    const dataToSave: NewTransaction = {
        description: formData.description,
        amount: amountAsNumber, // Usa o número convertido
        date: Timestamp.fromDate(new Date(formData.date)),
        category: formData.category,
        type: formData.type,
        ...(formData.type === 'expense' && { status: formData.status }),
    };
    
    const toastId = toast.loading('A guardar...');

    try {
        if (isEditing && currentTransactionId) {
            await updateTransaction(currentTransactionId, dataToSave);
            toast.success('Transação atualizada com sucesso!', { id: toastId });
        } else {
            await addTransaction(dataToSave);
            toast.success('Transação adicionada com sucesso!', { id: toastId });
        }
        closeModal();
    } catch (error) {
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} transação.`, { id: toastId });
        console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja excluir esta transação? Esta ação é irreversível.")) {
        const toastId = toast.loading('A excluir...');
        try {
            await deleteTransaction(id);
            toast.success('Transação excluída com sucesso!', { id: toastId });
        } catch (error) {
            toast.error('Erro ao excluir a transação.', { id: toastId });
            console.error(error);
        }
    }
  };

  if (authLoading || !user) {
    return <div className="text-center p-8">A carregar...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8 text-gray-800">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <p className="text-gray-600">Gestão Financeira</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Minhas Transações</h1>
          </div>
          <button onClick={openModalForCreate} className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C800C8] text-black font-semibold hover:bg-fuchsia-500 transition-all duration-300 shadow-md">
            <Plus size={20} />
            Adicionar Transação
          </button>
        </header>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 font-semibold"><Filter size={16} /> Filtrar por:</div>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 w-full md:w-auto"/>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 w-full md:w-auto">
                <option value="">Todas as Categorias</option>
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={() => { setFilterDate(''); setFilterCategory(''); }} className="text-sm text-gray-600 hover:text-[#C800C8]">Limpar filtros</button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          {transactionsLoading ? (
            <p className="p-6 text-center text-gray-500">A carregar transações...</p>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-sm">Descrição</th>
                  <th className="p-4 font-semibold text-sm">Valor</th>
                  <th className="p-4 font-semibold text-sm">Categoria</th>
                  <th className="p-4 font-semibold text-sm">Data</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">{t.description}</td>
                    <td className={`p-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-4"><span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{t.category}</span></td>
                    <td className="p-4">{t.date.toDate().toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      {t.type === 'expense' && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {t.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2 justify-center">
                        <button onClick={() => openModalForEdit(t)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Edit size={18}/></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
           {filteredTransactions.length === 0 && !transactionsLoading && (
              <p className="p-6 text-center text-gray-500">Nenhuma transação encontrada. Clique em "Adicionar Transação" para começar.</p>
           )}
        </div>
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
              <input type="number" step="0.01" name="amount" placeholder="Valor" value={formData.amount} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
              <input type="text" name="category" placeholder="Categoria (ex: Alimentação)" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]"/>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
              {formData.type === 'expense' && (
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C800C8]">
                    <option value="paid">Paga</option>
                    <option value="pending">Pendente</option>
                </select>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-[#C800C8] text-black font-semibold hover:bg-fuchsia-500">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}