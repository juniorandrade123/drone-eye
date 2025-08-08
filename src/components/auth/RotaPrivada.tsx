import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RotaPrivada = ({ children }) => {
  const token = sessionStorage.getItem('@mac-hub-token');
  const [exibirToast, setExibirToast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!token && !exibirToast) {
      toast({
        title: 'Sessão expirada.',
        description: 'Faça login novamente.',
      });
      setExibirToast(true);
    }
  }, [token, exibirToast, toast]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RotaPrivada;
