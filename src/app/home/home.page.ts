import { Component, OnInit, OnDestroy } from '@angular/core';

// FIREBASE SERVICE

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
// IONIC STORAGE
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { map } from 'rxjs/operators';
import { NavparamService } from '../navparam.service';
import { Router } from '@angular/router';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private cardCollection: AngularFirestoreCollection<Article>;

  cards = [
    0,1,2,3,4,5,6
  ]

  logo: string = '../../assets/SAFO_logo_farge.png';
  public appPages = [

    {
      title: 'Kommuner/fylkeskommuner',
      url: '/folder',
      icon: 'business'
    },
    {
      title: 'Helseforetak',
      url: '/gestion',
      icon: 'medkit'
    },
    {
      title: 'NAV',
      url: '/nav',
      icon: 'file-tray-full'
    },
    {
      title: 'Inspirasjon',
      url: '/inspirasjon',
      icon: 'bulb-outline'
    },
    {
      title: 'Kontakt oss',
      url: '/kontakt',
      icon: 'mail'
    }
  ];
  
  noticias: any;
 // favoritos: any;

  //private noticias: AngularFirestoreCollection<Article>;

  favoritos: any;

  estrella = 'Favoritter';
  public nameSubject = new BehaviorSubject<String>('Logg inn');

  constructor(public storage: Storage,  private navParamService: NavparamService,  private router: Router, private afu: AngularFireAuth, public afs:AngularFirestore) {
    this.isLoggedIn();
   }

  async ngOnInit() {
    
  console.log('NgOnInit HomePage')
    // this.noticias = await this.storage.get('favoritos');
   
  }
  ionViewDidLeave() {
    console.log('Funciona?')
    
  }

  irNoticia(noticia: Article) {

    this.navParamService.setNavData(noticia);
    this.router.navigate(['details/home'])
    
  }

  async readName() {

    let name = undefined;
    name = await this.storage.get('name');
    if ( name ) {
      this.nameSubject.next(name);
    }
    
  }
  
  isLoggIn() {
    return this.afu.authState.pipe(first())
 }



  isLoggedIn() {
    
    console.log('IsLoggedIn')
    let db = firebase.firestore();
     this.isLoggIn().pipe(

      tap(user => {
       
        if (user) {
          let theuser = firebase.auth().currentUser.uid

         /*

         
             
          
          var unsubscribe =  db.collection("dataSaved").where('userUid', '==' , theuser).onSnapshot( function(querySnap)  {
            querySnap.forEach( (doc) => {

              if (doc && doc.exists) {
                
                const data = doc.data();
                data.id = doc.id;
                console.log(data);
                this.noticias.push(data);
           
         
              } 
           
           
            })
            
            
          })
        
          unsubscribe()
          */
                    /*
          .onSnapshot(
            (querySnap) => {
              console.log(querySnap);
              querySnap.forEach(function(doc) {

                console.log(doc);

                if (doc && doc.exists) {
                  console.log(doc);

                  this.noticias = doc.data()
                  console.log(this.noticias)
                }
              })
            })
            */
      
         //   unsubscribe();

          
          this.cardCollection = this.afs.collection('dataSaved', ref =>  {
             return ref.where('userUid', '==', theuser)
     
           })
     
           this.cardCollection.snapshotChanges().pipe(
             map(actions => actions.map( a=> {
               const data = a.payload.doc.data() as Article;
               const id = a.payload.doc.id;
           
               return { id, ...data}
             }))
           )
           .subscribe( (data) => {
          
             this.noticias = data;
           })
          
         
           return true;
           
        
        } else {
          
              console.log('No existe usuario');
  
         this.cargarFavoritos();
       
      
        return true;
        }
      })
    )
    .subscribe()

  }


  // 

   async cargarFavoritos() {

   
    console.log('Cargar Favoritos')
    
    
    this.noticias = await this.storage.get('favoritos');

 //   console.log(this.noticias);
    

    if ( this.noticias == null || this.noticias.length == 0 || this.noticias == undefined)
    {

     
      
      this.estrella = 'Nyeste saker';

      this.cardCollection = this.afs.collection<Article>('articulos', ref=>{
        return ref.limit(6).orderBy('insertada',"desc")
      })
      
      this.cardCollection.snapshotChanges().
      pipe(
        map(actions => actions.map( a=> {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
      
          return { id, ...data}
        }))
      ).subscribe( (data) => {

        this.noticias = data;

      })
     

    }
    
    
    }


    


  


}
