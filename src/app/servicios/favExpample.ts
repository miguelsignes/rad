import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from './../interfaces/interfaces';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

import * as firebase from "firebase/app";
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  
  private cardCollection: AngularFirestoreCollection<Article>;
  noticias: Article[] = [];

  constructor(private storage: Storage, private toastCtrl: ToastController, private afu: AngularFireAuth, public afs:AngularFirestore) {

    this.discriminarFavoritos();

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

    firebase.auth().onAuthStateChanged( (user) => {

      if ( user ) {

        for ( const noti of this.noticias) {

          if ( noti.id === noticia.id) 
          {
            console.log(noti.id, noticia.id);
            existe = true;
            break;
          }
    
        }
    
        if ( existe ) {
          
            this.noticias = this.noticias.filter( noti => noti.id !== noticia.id);
            mensaje = 'Fjernet fra favoritter'

        } else {

          let db = firebase.firestore();
          console.log(noticia)
          console.log(firebase.auth().currentUser.uid);
          let userUid = firebase.auth().currentUser.uid;
          console.log(userUid);
       
      //    const noticia = item;
          const item = {userUid,...noticia}
          db.collection('dataSaved').doc().set(
            Object.assign({}, item)
          ).then(function(docRef) {
            console.log("Document written with ID: ", docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
          mensaje = 'Lagret i favoritter'
        }
        this.presentToast(mensaje);
     
     //   this.storage.set('favoritos', this.noticias);



    
        return !existe;



      } else {

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
          mensaje = 'Lagret i favoritter'
        }
        this.presentToast(mensaje);
        this.storage.set('favoritos', this.noticias);
    
        return !existe;

      }
    
  
 
    })



  }

  discriminarFavoritos() {
    firebase.auth().onAuthStateChanged( (user) => {

      if ( user ) {

        this.cargarFavoritosFirebase()
      } else {

        this.cargarFavoritos()
      }
       
   })
}
  
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

  cargarFavoritosFirebase() {

    let existe = false;
    let mensaje = '';

    firebase.auth().onAuthStateChanged( (user) => {
    
      let db = firebase.firestore();
      let theuser = firebase.auth().currentUser.uid

      this.cardCollection = this.afs.collection('dataSaved', ref =>  {
        return ref.where('userUid', '==', theuser)
      })

      this.cardCollection.snapshotChanges().pipe(
        map(actions => actions.map( a=> {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
      
          return { id, ...data}
        }))
      ).subscribe( (data) => {
        console.log(data);

        this.noticias = data || [];
      })

 
  return this.noticias;
      
    
    })




  }
}
