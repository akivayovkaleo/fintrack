import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Interface para uma transação, garantindo a tipagem em todo o hook
export interface Transaction {
  id: string; // ID é obrigatório para update/delete
  userId: string;
  description: string;
  amount: number;
  date: Timestamp;
  category: string;
  type: 'income' | 'expense';
  status?: 'paid' | 'pending';
}

// O tipo para adicionar uma nova transação (não precisa de id ou userId)
export type NewTransaction = Omit<Transaction, 'id' | 'userId'>;

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar as transações em tempo real
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const transactionsCollection = collection(db, "transactions");
    const q = query(transactionsCollection, where("userId", "==", user.uid));

    // onSnapshot "escuta" por mudanças na coleção em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      // Ordena as transações pela data mais recente
      transactionsData.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar transações:", error);
      toast.error("Não foi possível carregar as transações.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Função para adicionar uma nova transação
  const addTransaction = useCallback(async (transactionData: NewTransaction) => {
    if (!user) return toast.error("Você precisa estar logado.");
    try {
      await addDoc(collection(db, "transactions"), {
        ...transactionData,
        userId: user.uid,
      });
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      toast.error("Ocorreu um erro ao adicionar a transação.");
    }
  }, [user]);

  // Função para ATUALIZAR uma transação existente
  const updateTransaction = useCallback(async (transactionId: string, updatedData: Partial<NewTransaction>) => {
    try {
      const transactionDoc = doc(db, "transactions", transactionId);
      await updateDoc(transactionDoc, updatedData);
      toast.success("Transação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      toast.error("Ocorreu um erro ao atualizar a transação.");
    }
  }, []);

  // Função para DELETAR uma transação
  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      const transactionDoc = doc(db, "transactions", transactionId);
      await deleteDoc(transactionDoc);
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      toast.error("Ocorreu um erro ao deletar a transação.");
    }
  }, []);

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
};