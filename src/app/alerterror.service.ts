import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlerterrorService {

  constructor(public alertController: AlertController) { }

  async presentAlert(message) {
    const alert = await this.alertController.create({
       header: 'Alert',
    
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
