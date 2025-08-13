export interface Card {
  key: string;
  label: string;
  value: number;
  delta_pct_vs_prev_month: number;
}

export interface CentroDistribuicaoCard {
  id_cd: string;
  nome: string;
  status: string;
  dot: string;
  skus_ativos: number;
  ocupacao_pct: number;
  posicoes_ocupadas: number;
  posicoes_totais: number;
}

 export interface InventarioCard {
  id_cd: string;
  nome_cd: string;
  rua: string;
  hora: string;
  status: string;
}

 export interface AlertaCard {
  type: string;
  title: string;
  subtitle: string;
  severity: string;
  dot: string;
  meta: {
    mapeadas_no_dia: number;
    posicoes_totais: number;
    last_activity_utc: string;
    id_cd: string;
  };
}