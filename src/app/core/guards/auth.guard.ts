import { inject } from '@angular/core'; //inject permite acessar serviços do Angular dentro de funções, sem precisar usar o cosntrutor
import { CanActivateFn, Router } from '@angular/router';  //CanActivateFN é um tipo do Angular usado par criar Guards(usado para controlar o acesso e a navegação entre rotas) funcionais. Ele define uma função que decide se uma rota pode ser acessada.
import { AuthService } from '../services/auth.service';
import { Perfil } from '../models/usuario.model';


export const perfilGuard: CanActivateFn = () => {
    const auth = inject(AuthService);        //cria uma variável chamada auth e utiliza inject() para acessar o serviço de autenticação
    const router = inject(Router);           // acessa o serviço de navegaçaõ do Angular, será utlizado para redirecionar o usuario para outra pagina.
    return auth.autenticado() ? true : router.createUrlTree(['/login']);   //verifica se o usuario esta autenticado se estiver autenticado permite acessar a página se n , redireciona para a pagina de login

};

//libera a rota apenas para os perfis informados em `data: { perfis: [...] }`.
export const perfilGuard: CanActivateFn = (route) =>{
    const auth = inject(AuthService);    //acessa o serviço de autenticacao
    const router = inject(Router);       //acessa o servico de navegacao
    const usuario = auth.usuario();      //obtem os dados do usuario autenticado
    const permitidos = (route.data?.['perfis'] ?? []) as Perfil[];   //acessa os dados adicionais , pega a prioridade chamada perfis ['perfis'] se n existir nenhum valor , utiliza um array vazio e 'as perfil[]' inform ao TypeScript que o resutlado será tratado como uma lista de perfis 

    if(!usuario) return router.createUrlTree(['/login']);
    return permitidos.includes(usuario.perfil)  //include verifica se determinado valor existe dentro de um array e o usuario.perfil = perfil do usuario
    ? true
    : route.createUrlTree([auth.rotaInicial(usuario.perfil)]);   //se n tiver usuario autenticado , ele sera enviado para a pagina de login
};

export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();
  return usuario ? router.createUrlTree([auth.rotaInicial(usuario.perfil)]) : true;  //usuario verifica se existe um usuário, ?router.create (se existir, redireciona para a página inicial correspondentre ao perfil dele)
};
