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
