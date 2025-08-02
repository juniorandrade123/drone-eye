import { Selected } from '@core/model/selected';
import {
  SkuDto,
  SkuResum,
  SkuStatusEnum,
} from './components/query-by-sku/model/sku';

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
