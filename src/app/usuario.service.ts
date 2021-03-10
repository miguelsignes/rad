import { Injectable } from '@angular/core';
import { Usuario } from './interfaces/interfaces';

// FIREBASE SERVICE

import { FirestoreService } from './servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { AlerterrorService } from './alerterror.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token:string = null;
  data: any = [];

  public nameSubject = new BehaviorSubject<String>('Logg inn');

  constructor(private afu: AngularFireAuth, private navCtrl: NavController, private afs: AngularFirestore, private alert: AlerterrorService) {

   
   }

  readStorage() {

    const data = localStorage.getItem('token');
    if ( data ) {

      this.nameSubject.next('Logg ut');

    }


  }

  removeStorage() {
  
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    
   this.nameSubject.next('Logg inn');

    
    
  }

  logout() {
    
        
    this.nameSubject.next('Logg inn')
   
        

     

    this.afu.signOut()
      .then( () => {

 
        let mensaje = 'Usuario desconecta correctamente';
     
        localStorage.removeItem('favoritos');   
        localStorage.removeItem('token');
        localStorage.removeItem('name');
    //    console.log(this.nameSubject);
      this.alert.presentAlert(mensaje);
       this.navCtrl.navigateRoot('/', { animated: true })
      
      }).catch ( (error) => {
        let mensaje = 'Ha ocurrido un error';
        this.alert.presentAlert(mensaje);
        console.log('error',error)
      } )
  }

  login(email: string, password:string)  {

    const data = { email, password};

    return this.afu.signInWithEmailAndPassword(data.email,data.password)
    .then( result => {

      console.log(result);
      result.user.getIdToken().then( (token)=> {
        localStorage.setItem('token', token);
        this.nameSubject.next('Logg ut');
        localStorage.setItem('name', result.user.displayName);
      });
   
    }).catch ( error => {
      console.log('Hay algún error o No se encontró el usuario', error)
    })

  }

  register(email:string, password:string, name:string) {
    const data = { email, password, name};

    return this.afu.createUserWithEmailAndPassword(data.email, data.password)
    .then( result => {
      console.log(result);
      result.user.updateProfile({
        displayName:data.name
      });
    
      result.user.getIdToken().then( (token)=> {

        localStorage.setItem('token', token);
        localStorage.setItem('name', result.user.displayName);
     
      
      });
      console.log(email);
      console.log(data.email);
      this.createUserStats(result.user.uid, email);

    })
  }

  createUserStats(id, email) {
   
 

    this.data.email = email;
    this.data.isAdmin = false;
   
    this.afs.collection('userProfile').doc(id).set(Object.assign({}, this.data))
    .then( (response) => {
      console.log('todo ok');
    }).catch( (error) => {
      console.log('Ha ocurrido un error', error)
    })


  }

}
