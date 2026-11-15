export type Perfil = 'atendente' | 'coordenador' | 'cliente';

export interface Usuario{
    id: number;
    nome: string;
    email: string;
    perfil: Perfil;
}