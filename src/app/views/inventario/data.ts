import { Selected } from '@core/model/selected';
import {
  IndicadorInventario,
  PaleteStatusEnum,
  SkuDto,
  SkuGridView,
  SkuResum,
  SkuStatusEnum,
  Totalizadores
} from './components/model/sku';

export const distributionCenter: Selected[] = [
  { value: 0, description: 'Todos os CDs' },
  { value: 1, description: 'CD São Paulo' },
  { value: 2, description: 'CD Rio de Janeiro' },
  { value: 3, description: 'CD Belo Horizonte' },
];

export const periods: Selected[] = [
  { value: 0, description: 'Todos os períodos' },
  { value: 1, description: 'Hoje' },
  { value: 2, description: 'Última semana' },
  { value: 3, description: 'Último mês' },
];

export const skus: SkuDto[] = [
  {
    id: 0,
    codigo: 1,
    status: SkuStatusEnum.EM_ESTOQUE,
    produto: 'A',
    cd: 'CD São Paulo',
    localizacao: 'A-12 - P-05',
    palete: 'PAL-001',
    quantidade: 150,
    dataInventario: new Date(),
    quantidadeFotos: 2,
  },
  {
    id: 1,
    codigo: 2,
    status: SkuStatusEnum.BAIXO_ESTOQUE,
    produto: 'A',
    cd: 'CD São Paulo',
    localizacao: 'A-12 - P-05',
    palete: 'PAL-001',
    quantidade: 150,
    dataInventario: new Date(),
    quantidadeFotos: 2,
  },
  {
    id: 2,
    codigo: 3,
    status: SkuStatusEnum.SEM_ESTOQUE,
    produto: 'A',
    cd: 'CD São Paulo',
    localizacao: 'A-12 - P-05',
    palete: 'PAL-001',
    quantidade: 150,
    dataInventario: new Date(),
    quantidadeFotos: 2,
  },
];

export const skuResum: SkuResum = {
  qtdEncontrados: 3,
  qtdEmEstoque: 1,
  qtdBaixoEstoque: 1,
  qtdSemEstoque: 1,
};

export const streets: Selected[] = [
  { value: 1, description: 'A-10' },
  { value: 2, description: 'A-11' },
  { value: 3, description: 'B-05' },
];

export const inventarios: IndicadorInventario = {
  concluido: 78,
  tempoDecorrido: 2.3,
  tempoRestante: 2.2,
  tempoTotalEstimado: 4.5,
  paletesHora: 2,
  ruasHora: 0.9,
};

export const totalizadores: Totalizadores = {
  totalPaletes: 9,
  lidos: 4,
  naoLidos: 3,
  vazios: 2,
};

export const resultsViewGrid: SkuGridView = {
  rua: 'A-10',
  cd: 'São Paulo',
  paletesPorPosicao: 6,
  indicadoresInventario: inventarios,
  totalizadores: totalizadores,
  posicoes: [
    {
      id: 1,
      numero: '001',
      paletes: [
        {
          id: 1,
          posicao: '001',
          codigo: 'SKU001',
          status: PaleteStatusEnum.SUCESSO,
          caminhoImagem:
            'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
        },
        {
          id: 2,
          posicao: '002',
          codigo: 'SKU002',
          status: PaleteStatusEnum.SUCESSO,
          caminhoImagem:
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
        },
        {
          id: 3,
          posicao: '003',
          codigo: 'SKU003',
          status: PaleteStatusEnum.ERRO_LEITURA,
          caminhoImagem:
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
        },
        {
          id: 4,
          posicao: '004',
          status: PaleteStatusEnum.SEM_LEITURA,
        },
      ],
    },
    {
      id: 2,
      numero: '002',
      paletes: [
        {
          id: 1,
          posicao: '007',
          status: PaleteStatusEnum.SEM_LEITURA,
        },
        {
          id: 3,
          posicao: '008',
          codigo: 'SKU006',
          status: PaleteStatusEnum.ERRO_LEITURA,
          caminhoImagem:
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
        },
      ],
    },
  ],
};
