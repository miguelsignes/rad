import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// FIREBASE SERVICE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


// IONIC STORAGE
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';


import { DataLocalService } from '../servicios/data-local.service';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { NavparamService } from '../navparam.service';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/auth';
import { first, tap } from 'rxjs/operators';
import * as firebase from "firebase/app";
import { Observable, ObservedValueOf } from 'rxjs';

export interface CardId extends Article { id: string; }
export interface Users { nombre: string, email: string, favoritos: Object }
@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})

export class FavsPage implements OnInit {


  noticias: Observable<CardId[]>;
  title:string;
  tag:any = [];
  searchTerm: string = "";
  favoritos:any = null;
  firebaseOn = false;
  private cardCollection: AngularFirestoreCollection<Article>;
  
  noticia: Article[] = [];
  
  constructor(private activatedRoute: ActivatedRoute, 
     public dataLocalService: DataLocalService,
     public storage: Storage,
     private router: Router,
     private navParamService: NavparamService,
    public afu:AngularFireAuth,
    public afs:AngularFirestore,
     ) {
   
   }

  gotoNoticia(noticia: Article) {

     
 
//    this.router.navigate(['details/'+ {'noticia':noticia }])

    this.navParamService.setNavData(noticia);
    this.router.navigate(['details/Fav'])

  }
  ngOnInit() {

    this.discriminarFavoritos();
    
  }

  async cargarFavoritos() {

     this.favoritos = await this.storage.get('favoritos');

      if ( this.favoritos) {
      this.noticias = this.favoritos;
    }
    
    }

  
    filtrarArticulos(event) {

    
      this.searchTerm = event.detail.value;
      console.log(this.searchTerm);
       
  
    }

    isLoggedIn() {
      return this.afu.authState.pipe(first())
   }

    discriminarFavoritos() {


      this.isLoggedIn().pipe(

       tap(user => {
         if (user) {
   
           this.cargarFavoritosFirebase()
           this.firebaseOn = true;
         } else {
           
           this.cargarFavoritos()
         }
       })
     )
     .subscribe()
   
     }


     cargarFavoritosFirebase() {

      
      let theuser = firebase.auth().currentUser.uid;
  
      this.cardCollection = this.afs.collection('dataSaved', ref =>  {
            return ref.where('userUid', '==', theuser)
          })


       this.noticias = this.afs.collection('dataSaved', ref => 
          ref.where('userUid', '==', theuser)
        ).snapshotChanges()
        .pipe(
         map(actions => actions.map( a=> {
           const data = a.payload.doc.data() as Article;
           const id = a.payload.doc.id;
           return { id, ...data}
         }))
         
       )
  
       
  

       
    }
  

}
