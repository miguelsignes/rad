import { Injectable } from '@angular/core';
import { Usuario } from './interfaces/interfaces';
// FIREBASE SERVICE
import { FirestoreService } from './servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token:string = null;

  public nameSubject = new BehaviorSubject<String>('Loggin IN');

  constructor(private afu: AngularFireAuth) {

   
   }

  readStorage() {
    const data = localStorage.getItem('name');
    if ( data ) {
      this.nameSubject.next(data);
    }
  }
  login(email: string, password:string)  {

    const data = { email, password};

    return this.afu.signInWithEmailAndPassword(data.email,data.password)
    .then( result => {
      console.log(result);
      result.user.getIdToken().then( (token)=> {
       
        localStorage.setItem('token', token);
        this.nameSubject.next(result.user.displayName);
        localStorage.setItem('name', result.user.displayName)
      });
   
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
