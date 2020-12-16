import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../servicios/data-local.service';
import { ActivatedRoute } from '@angular/router';
// FIREBASE SERVICE
import { FirestoreService } from '../servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';
// IONIC STORAGE
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { map } from 'rxjs/operators';
import { Observable, ObservedValueOf } from 'rxjs';

import { NavparamService } from '../navparam.service';
import { Router } from '@angular/router';
import * as firebase from "firebase/app";
import 'firebase/auth';
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
  
  noticias: Article[] = [];
  favoritos: any = [];

  //private noticias: AngularFirestoreCollection<Article>;

  public nameSubject = new BehaviorSubject<String>('Logg inn');

  constructor(public dataLocalService: DataLocalService,
    public storage: Storage,    private navParamService: NavparamService,  private router: Router, private afu: AngularFireAuth, private afs:AngularFirestore) { }

  ngOnInit() {
    
    this.cargarFavoritos()
    this.cardCollection = this.afs.collection<Article>('articulos/', ref=>{
      return ref.limit(6)
    });

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
  
  isLoggedIn() {
    
    firebase.auth().onAuthStateChanged( function(user) {
      if ( user ) {
        console.log(firebase.auth().currentUser.uid)
        return true
      } else {
        console.log('No existe usuario');
        return false;
      }
    })

  }

  async cargarFavoritos() {

    //if (firebase.auth().currentUser)
    
    this.isLoggedIn();


    this.favoritos = await this.storage.get('favoritos');

    if ( this.favoritos == null || this.favoritos.length == 0)
    {

      console.log('favoritos', this.favoritos)
      this.cardCollection.snapshotChanges().pipe(
        map(actions => actions.map( a=> {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
      
          return { id, ...data}
        }))
      ).subscribe( (data) => {
        console.log(data);
        this.noticias = data;
      })

    }  else {
      console.log('favoritos', this.favoritos)
      this.noticias = this.favoritos;
    }
 
    
    
    }


    


  


}
