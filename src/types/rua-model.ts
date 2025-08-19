export interface RuaDTO {
    id: string;
    id_cd: string;
    id_empresa: string;
    nome_rua: string;
    etiqueta_palete: string;
    etiqueta_posicao: string;
    paletes_por_posicao: number;
    tipo_armazenagem_id: string;
    total_posicoes: number;
    ativo: boolean;
    criado_em: string;
    atualizado_em: string;
}