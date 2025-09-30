// src/hooks/useTransactions.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  Timestamp,
  // Faltava a importação do 'doc', 'updateDoc', 'deleteDoc' se for usar no futuro
} from 'firebase/firestore';
// A LINHA MAIS IMPORTANTE: Importa a nossa instância 'db' do Firebase
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Definindo a interface para uma transação
export interface Transaction {
  id?: string;
  userId: string;
  description: string;
  amount: number;
  date: Timestamp;
  category: string;
  type: 'income' | 'expense';
  status?: 'paid' | 'pending';
}

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
    // Usamos a instância 'db' importada para referenciar a coleção
    const transactionsCollection = collection(db, "transactions");
    const q = query(transactionsCollection, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
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

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar uma transação.");
      return;
    }
    try {
      // Usamos 'db' aqui também
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

  return { transactions, loading, addTransaction };
};