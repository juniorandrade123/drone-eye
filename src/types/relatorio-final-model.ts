export interface RelatorioFinal {
    id: string;
    imagem_posicao: string;
    codigo_posicao: string;
    codigo_palete: string;
    imagem_palete: string;
    datahora: string;
    empresa_nome: string;
    usuario_nome: string;
    cd_nome: string;
    codigo_rua: string;
    posicao: string;
}


export type PaleteStatus = 'lido' | 'nao-lido' | 'vazio';

export interface PaleteInventario {
    id: string;
    status: PaleteStatus;
    sku: string | null;
    foto: string | null;
}

export interface PosicaoInventario {
    id: string;
    paletes: PaleteInventario[];
}

export interface RuaInventario {
    totalPosicoes: number;
    paletePorPosicao: number;
    tempoInicioInventario?: string;
    tempoEstimadoTotal?: number;
    ruasConcluidas: number;
    posicoes: PosicaoInventario[];
}

export type DadosInventario = {
    [cdNome: string]: {
        [ruaNome: string]: RuaInventario;
    };
};