// src/hooks/useQuotes.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiQuotes {
  dollar: string | null;
  ibovespa: string | null;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<ApiQuotes>({ dollar: null, ibovespa: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dollarRes, ibovRes] = await Promise.all([
          axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
          axios.get(`https://brapi.dev/api/quote/^BVSP?token=${process.env.NEXT_PUBLIC_BRAPI_TOKEN}`)
        ]);

        const formattedDollar = `${parseFloat(dollarRes.data.USDBRL.bid).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        const ibovValue = `${ibovRes.data.results[0].regularMarketPrice.toLocaleString('pt-BR')} pts`;

        setQuotes({ dollar: formattedDollar, ibovespa: ibovValue });
      } catch (err) {
        console.error("Erro ao buscar cotações:", err);
        setError("Não foi possível carregar as cotações. Tente novamente mais tarde.");
        setQuotes({ dollar: 'Erro', ibovespa: 'Erro' });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return { quotes, loading, error };
};