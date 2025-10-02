'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// Define a "forma" do nosso contexto, para garantir a tipagem
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Cria o contexto que será compartilhado com a aplicação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provedor, que vai envolver a aplicação e fornecer os dados de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect para monitorar o estado de autenticação do Firebase em tempo real
  useEffect(() => {
    // onAuthStateChanged retorna uma função `unsubscribe` para limpar o "ouvinte"
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Função de limpeza: remove o "ouvinte" quando o AuthProvider é desmontado
    return () => unsubscribe();
  }, []);

  // Função de logout que encerra a sessão no Firebase e redireciona o usuário
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // Após o logout, redireciona para a página inicial de forma segura
      router.push('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // O valor que será fornecido para todos os componentes filhos
  const value = {
    user,
    loading,
    logout,
  };
  
  // Renderiza os filhos apenas quando o estado de autenticação já foi verificado.
  // Isso evita "piscar" a tela entre estados de logado/deslogado.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto nos componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Garante que o hook só possa ser usado dentro de um AuthProvider
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};