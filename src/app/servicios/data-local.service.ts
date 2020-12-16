import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from './../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  

  noticias: Article[] = [];

  constructor(private storage: Storage, private toastCtrl: ToastController) {

    this.cargarFavoritos();

   }

   async presentToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }
  
  guardarNoticia(noticia: Article) {
    let existe = false;
    let mensaje = '';

    for ( const noti of this.noticias) {

      if ( noti.id === noticia.id) 
      {
        existe = true;
        break;
      }

    }

    if ( existe ) {
        this.noticias = this.noticias.filter( noti => noti.id !== noticia.id);
        mensaje = 'Fjernet fra favoritter'
    } else {
      this.noticias.push(noticia);
      mensaje = 'Ingen favoritter lagret'
    }
    this.presentToast(mensaje);
    this.storage.set('favoritos', this.noticias);
    return !existe;

  }
  

  /*

  guardarNoticia(noticia: Article) {

     let mensaje = '';
    console.log(this.noticias);
    
   
    const existe = this.noticias.find( noti => noti.id === noticia.id)

    if (!existe) {
      
      this.noticias.unshift(noticia);
      this.storage.set('favoritos', this.noticias);
      console.log('Existia')
      mensaje = 'Añadido a Favoritos'

  
    } else  {

      this.noticias = this.noticias.filter( noti => noti.id !== noticia.id)
      this.storage.set('favoritos', this.noticias);
      mensaje = 'Eliminado de Favoritos'
      console.log('No existia')
    }
   
    this.presentToast( mensaje );
  //  this.storage.set('noticias', this.noticias );

    

  }
*/
  async cargarFavoritos() {

  const favoritos = await this.storage.get('favoritos');
  this.noticias = favoritos || []; 
  return this.noticias;
  /*
  if ( favoritos) {
    this.noticias = favoritos;
  }
  */
  }

}
