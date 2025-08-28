export interface PosicaoEstoque{
    id?: string;
    id_empresa: string;
    id_cd: string;
    id_rua: string;
    descricao: string;
    bloco: string;
    modulo: string;
    nivel: string;
    posicao: string;
    capacidade_paletes: number;
    tipo_armazenagem_id: string;
    status: string;
    ativo: boolean;
    codigo_posicao: string;
}