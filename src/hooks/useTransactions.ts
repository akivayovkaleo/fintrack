// src/hooks/useTransactions.ts
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

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: Timestamp;
  category: string;
  type: 'income' | 'expense';
  status?: 'paid' | 'pending';
}

export type NewTransaction = Omit<Transaction, 'id' | 'userId'>;

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      transactionsData.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar transações:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = useCallback(async (transactionData: NewTransaction) => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar uma transação.");
      throw new Error("Utilizador não autenticado");
    }
    try {
      await addDoc(collection(db, "transactions"), {
        ...transactionData,
        userId: user.uid,
      });
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      console.error(error);
    }
  }, [user]);

  const updateTransaction = useCallback(async (transactionId: string, updatedData: Partial<NewTransaction>) => {
    try {
      const transactionDoc = doc(db, "transactions", transactionId);
      await updateDoc(transactionDoc, updatedData);
      toast.success("Transação atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar transação.");
      console.error(error);
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      const transactionDoc = doc(db, "transactions", transactionId);
      await deleteDoc(transactionDoc);
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar transação.");
      console.error(error);
    }
  }, []);

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
};