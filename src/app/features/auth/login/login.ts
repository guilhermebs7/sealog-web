import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',   //define o nome pelo qual o componente pode ser identificado no HTML
  standalone: true,         //significa que esse componente é independente e não precisa ser declarado em um NgModule.
  imports: [ReactiveFormsModule, RouterLink],  //informa quais recursos externos o componente utilizará em seu HHTML.
  templateUrl: './login.component.html',  //informa onde o arquivo HTML responsável pela aparência da tela de login
  styleUrl: './login.component.scss',
})
export class LoginComponent{
    private readonly fb= inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    readonly erro = signal<string | null>(null);   //cria uma variavel reativa chamada erro. Significa que essa variavel pode armazenar uma mensagem em formato de texto ou null

    //formulario
    readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],   // diz que o campo email e obrigatorio e valida se ta em formato de emaail
    senha: ['', [Validators.required, Validators.minLength(4)]],  //determina que a senha precisa ter pelo menos quatro caracters
  });

  entrar(): void {
    this.erro.set(null);  // se o usuario tentou entrar com uma senha incorreta , apareceu uma mensagem. Quando ele tentar novamente , queremos começar sem a mensagem antiga. isso limpa
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // marca todos os campos do formulario com tocados.
      return;
    }

    const { email, senha } = this.form.getRawValue();   //pega os dados digitados
    if (!this.auth.login(email, senha)) {
      this.erro.set('E-mail ou senha inválidos.');
      return;
    }

    const usuario = this.auth.usuario()!;     //identifica o usuario autenticado
    this.router.navigateByUrl(this.auth.rotaInicial(usuario.perfil));
  }

}