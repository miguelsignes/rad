import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUser = {
    email: '',
    password: ''
  };

  registerUser: Usuario = {
    email: 'test',
    password: '123456',
    nombre: 'Test',
    avatar: 'av-1.png'
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  async login(flogin: NgForm) {

    if ( flogin.invalid ) { return; }
    const valido = this.usuarioService.login(this.loginUser.email, this.loginUser.password);

    if ( valido ) {

       console.log('OK');
       
    } else {

      console.log('NO OK')
    }
  }

  async registrarrUser(fRegistro: NgForm) {
    if (fRegistro.invalid) { return; } 
    const valido = this.usuarioService.register(this.registerUser.email, this.registerUser.password, this.registerUser.nombre);
    if (valido) {
      console.log("OK");
    } else {
      console.log( 'NOT OK')
    }
  }

}
