import { Component, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../usuario.service';
import { IonSlides, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlerterrorService } from '../../alerterror.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides;

  loginUser = {
    email: '',
    password: ''
  };

  registerUser: Usuario = {
    email: '',
    password: '',
    nombre: '',
    avatar: 'av-1.png'
  };

  constructor(private usuarioService: UsuarioService, private navCtrl: NavController, public loadingController: LoadingController, private alertC: AlerterrorService) { }

  ngOnInit() {
  }

  
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Wait....',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }


   login(flogin: NgForm) {

    if ( flogin.invalid ) { return; }
    
    const valido = this.usuarioService.login(this.loginUser.email, this.loginUser.password);

    if ( valido ) {

      
      setTimeout(() => {

        this.navCtrl.navigateRoot('/', { animated: true })
      }, 2000);
  
      let message = ' Usuario logueado correctamente';
      this.alertC.presentAlert(message);

       
    } else {

      console.log('NO OK')
    }
  }

   registrarrUser(fRegistro: NgForm) {
    if (fRegistro.invalid) { return; } 
    const valido = this.usuarioService.register(this.registerUser.email, this.registerUser.password, this.registerUser.nombre);
    if (valido) {
      console.log("OK");
      
    } else {
      console.log( 'NOT OK')
    }
  }


  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
