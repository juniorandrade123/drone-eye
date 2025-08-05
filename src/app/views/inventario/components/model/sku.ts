export interface SkuDto {
  id: number;
  codigo: number;
  status: SkuStatusEnum;
  produto: string;
  cd: string;
  localizacao: string;
  palete: string;
  quantidade: number;
  dataInventario: Date;
  quantidadeFotos: number;
}

export enum SkuStatusEnum {
  EM_ESTOQUE = 0,
  BAIXO_ESTOQUE = 1,
  SEM_ESTOQUE = 2,
}

export interface SkuResum {
  qtdEncontrados: number;
  qtdEmEstoque: number;
  qtdBaixoEstoque: number;
  qtdSemEstoque: number;
}

export interface SkuGridView {
  rua: string;
  cd: string;
  paletesPorPosicao: number;
  posicoes: PosicoesDto[];
  indicadoresInventario: IndicadorInventario;
  totalizadores: Totalizadores;
}

export interface PosicoesDto {
  id: number;
  numero: string;
  paletes: PaletesDto[];
}

export interface PaletesDto {
  id: number;
  posicao: string;
  codigo?: string;
  status: PaleteStatusEnum;
  caminhoImagem?: string;
}

export enum PaleteStatusEnum {
  SUCESSO = 0,
  ERRO_LEITURA = 1,
  SEM_LEITURA = 2,
}

export interface IndicadorInventario {
  concluido: number;
  tempoDecorrido: number;
  tempoRestante: number;
  tempoTotalEstimado: number;
  paletesHora: number;
  ruasHora: number;
}

export interface Totalizadores {
  totalPaletes: number;
  lidos: number;
  naoLidos: number;
  vazios: number;
}
