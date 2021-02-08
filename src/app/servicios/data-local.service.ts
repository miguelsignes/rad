import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from './../interfaces/interfaces';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

import * as firebase from "firebase/app";
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  
  private cardCollection: AngularFirestoreCollection<Article>;
  noticias: Article[] = [];

  constructor(private storage: Storage, private toastCtrl: ToastController, private afu: AngularFireAuth, public afs:AngularFirestore) {

    this.discriminarFavoritos();
    console.log('Data Local Service')

   }

   async presentToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }
  



  guardarNoticiaStorage(noticia: Article) {

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
      mensaje = 'Lagret i favoritter'
    }
    this.presentToast(mensaje);
    this.storage.set('favoritos', this.noticias);
    return !existe;

  }
guardarNoticiaFirebase(noticia:Article) {

  let mensaje = '';
  let userUid = firebase.auth().currentUser.uid;
  let db = firebase.firestore();
 // let query = db.collection('dataSaved').where('userUid','==',userUid).where('id','==',noticia.id).get()

  let request = this.afs.collection('dataSaved', ref => ref.where('userUid', '==', userUid).where('id','==',noticia.id)).get().subscribe(users => { 
    
    if(users.size > 0){
      console.log("exists");
      console.log(users.size);
      mensaje = 'Fjernet fra favoritter'


      let query = db.collection('dataSaved').where('userUid','==',userUid).where('id','==',noticia.id);
      query.get().then( (querySnapShot) => {
        querySnapShot.forEach( (doc)=> {
          doc.ref.delete();
        })
      })
  


      this.presentToast(mensaje);


    }else{

      mensaje = 'Lagret i favoritter'
      console.log("doesn't exist");
      console.log(users.size);

      let userUid = firebase.auth().currentUser.uid;

      const item = {userUid,...noticia}

      db.collection('dataSaved').doc().set(
        Object.assign({}, item)
      ).then(function(docRef) {
        console.log("Document written with ID: ", docRef);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    this.presentToast(mensaje);

    }
  });


}
  /*
  guardarNoticiaFirebase(noticia: Article) {

    let existe = false;
    let mensaje = '';
    
    console.log(noticia.id);

    console.log('Esto es la cagada', this.noticias)
    
   
    for ( const noti of this.noticias) {

      console.log('bicle comparando', noti.id, noticia.id);

      if ( noti.id === noticia.id) 
      {
       
        existe = true;
        break;
      }

    }

    if ( existe ) {
     
      
      console.log('Este documento existe, no voy a agregar ninguno');
      let db = firebase.firestore();
      console.log(firebase.auth().currentUser.uid);
      let userUid = firebase.auth().currentUser.uid;
      mensaje = 'Fjernet fra favoritter'
      let query = db.collection('dataSaved').where('userUid','==',userUid).where('id','==',noticia.id);
      query.get().then( (querySnapShot) => {
        querySnapShot.forEach( (doc)=> {
          doc.ref.delete();
        })
      })
  
      return;

    } else {
      
      
      let db = firebase.firestore();
      console.log('Este documento no existe en la base de datos.')
      
      let userUid = firebase.auth().currentUser.uid;
      mensaje = 'Lagret i favoritter'
      const item = {userUid,...noticia}
      db.collection('dataSaved').doc().set(
        Object.assign({}, item, {merge:true})
      ).then(function(docRef) {
        console.log("Document written with ID: ", docRef);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    return;




    }

    this.presentToast(mensaje);
  }
    
  
*/

isLoggedIn() {
  return this.afu.authState.pipe(first())
}


  discriminarFavoritos() {


    this.isLoggedIn().pipe(
      tap(user => {
        if (user) {
  
          this.cargarFavoritosFirebase()
        } else {
          
          this.cargarFavoritos()
        }
      })
    )
    .subscribe()


  }

  /*
    firebase.auth().onAuthStateChanged( (user) => {

      if ( user ) {

        this.cargarFavoritosFirebase()
      } else {

        this.cargarFavoritos()
      }
       
   })

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



  cargarFavoritosFirebase() {

    let existe = false;
    let mensaje = '';

    firebase.auth().onAuthStateChanged( (user) => {
    
      if (user) {
        
      //  let db = firebase.firestore();
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
        
          this.noticias = data || [];
        })
  
   
           return this.noticias;
      }

      
    
    })




  }
}
