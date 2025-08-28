
export interface TipoArmazenagem {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  capacidade_max_paletes: number;
  altura_max_cm: number;
  peso_max_kg: number;
  permite_empilhamento: boolean;
  permite_rotacao: boolean;
  requer_equipamento: boolean;
  equipamento_necessario: string;
  id_categoria: string;
  id_empresa: string;
  ativo: boolean;
  criado_em: string;
}
