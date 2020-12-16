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
  data: any = [];

  public nameSubject = new BehaviorSubject<String>('Logg inn');

  constructor(private afu: AngularFireAuth, private navCtrl: NavController, private afs: AngularFirestore) {

   
   }

  readStorage() {



    const data = localStorage.getItem('token');
    if ( data ) {

      this.nameSubject.next('Logg ut');

    }




  }

  removeStorage() {

    

    this.afu.signOut();
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    
   this.nameSubject.next('Logg inn');

    
    this.navCtrl.navigateRoot('/home', { animated: true })

  }

 async logout() {
    await this.afu.signOut()
      .then( () => {
        
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        this.nameSubject.next('Logg inn');
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
        this.nameSubject.next('Logg ut');
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
     
      
      });
      console.log(email);
      console.log(data.email);
      this.createUserStats(result.user.uid, email);

    })
  }

  createUserStats(id, email) {
   
    console.log(id);
    console.log(email);

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
