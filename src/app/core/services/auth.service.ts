import { Injectable, computed, signal } from '@angular/core'; //injectable (um decorador que permite que uma classe seja utilizada como servico no angular , exemplo: queremos utilizar o authService em outras partes do sistema, como componentes e Guards). computed( cria um valor calculado automaticamente a partir de outro valor. No nosso código , ele será utilizado para descobrir se existe um usuário logado). Signal cria uma variavel reativa( o Angular consegue acompnahar quando o valor dessa variavel muda)
import { Perfil, Usuario } from '../models/usuario.model';

interface UsuarioMock extends Usuario{  //acrescenta a senha 
    senha: string;
}

const STORAGE_KEY = 'sealog.usuario';  //guarda os dados do usuario autenticado

//Usuários fictícios (projeto somente front end, sem back end). 
const USUARIOS_MOCK: UsuarioMock[] = [
  { id: 1, nome: 'Ana Atendente', email: 'atendente@sealog.com', senha: 'demo123', perfil: 'atendente' },
  { id: 2, nome: 'Carlos Coordenador', email: 'coordenador@sealog.com', senha: 'demo123', perfil: 'coordenador' },
  { id: 3, nome: 'Cliente Exemplo', email: 'cliente@sealog.com', senha: 'demo123', perfil: 'cliente' },
];

@Injectable({providedIn: 'root'})   //informa ao Angular que essa classe sera um serviço disponivel para a aplicacao. Injectable( decorador que permite utilizar a classe por meio da injecao de dependencia), providedIn(informa onde o servico sera disponbilizado), root(significa que o servico estara disponivel globalmente na aplicacao)
export class AuthService{
    private readonly _usuario = signal<Usuario | null>(this.restaurar());

    readonly usuario = this._usuario.asReadonly(); //outros arquivos podem consultar os dados do usuario, mas n podem modificar diretamente esse signal
    readonly autenticado = computed(() => this._usuario() !== null);   //verifica se existe um usuario autenticado

    login(email: string, senha: string): boolean {
    const encontrado = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha,
    );
    if (!encontrado) return false;

    const { senha: _senha, ...usuario } = encontrado;     // o codigo separa a senha do restante dos dados,obersve que a senha n esta mais dentro do objeto usuario. Isso evita armazenar a ssenha junto aos dados da sessao
    this._usuario.set(usuario);        //atualiza o Signal _usuario com os dados do usuario que acabou de fazer login
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));    //armazena os dados do usuario no navegador
    return true;
  }

  logout(): void {
    this._usuario.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  rotaInicial(perfil: Perfil): string {
    return `/${perfil}`;
  }

  private restaurar(): Usuario | null {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? (JSON.parse(salvo) as Usuario) : null;
    } catch {
      return null;
    }
  }


}