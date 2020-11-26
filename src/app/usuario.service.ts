import { Injectable } from '@angular/core';
import { Usuario } from './interfaces/interfaces';

// FIREBASE SERVICE

import { FirestoreService } from './servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token:string = null;

  public nameSubject = new BehaviorSubject<String>('Loggin IN');

  constructor(private afu: AngularFireAuth, private navCtrl: NavController) {

   
   }

  readStorage() {

    const data = localStorage.getItem('name');
    if ( data ) {

      this.nameSubject.next(data);

    }
  }

  removeStorage() {

    

    this.afu.signOut();
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    
   this.nameSubject.next('Loggin IN');

    
    this.navCtrl.navigateRoot('/home', { animated: true })

  }

 async logout() {
    await this.afu.signOut()
      .then( () => {
        
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        this.nameSubject.next('Loggin IN');
        console.log(this.nameSubject);
      })
  }

  login(email: string, password:string)  {

    const data = { email, password};

    return this.afu.signInWithEmailAndPassword(data.email,data.password)
    .then( result => {
      console.log(result);
      result.user.getIdToken().then( (token)=> {
      
        localStorage.setItem('token', token);
        this.nameSubject.next('Logged Out');
        localStorage.setItem('name', result.user.displayName);
      });
   
    }).catch ( result => {
      console.log('Hay algún error o No se encontró el usuario')
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
      })
   

    })
  }

}
