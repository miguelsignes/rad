import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../usuario.service';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private usuarioService: UsuarioService, private navCtrl: NavController) { }

  ngOnInit() {
  }


async  logout() {
 //   this.usuarioService.removeStorage()
await  this.usuarioService.logout();
  this.navCtrl.navigateRoot('/', { animated: true})
  console.log('OK')
 
  
  }

}
