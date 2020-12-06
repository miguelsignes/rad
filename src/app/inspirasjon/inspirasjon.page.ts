import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// FIREBASE SERVICE
import { FirestoreService } from '../servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

//SEARCH BAR DATA SERVICE
import { DataService } from '../servicios/data.service';

// IONIC STORAGE
import { Storage } from '@ionic/storage';

import { Article } from '../interfaces/interfaces';

import { Observable, ObservedValueOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataLocalService } from '../servicios/data-local.service';
import { Router } from '@angular/router';

import { NavparamService } from '../navparam.service';
//export interface Card { title: string; texto: string; categoria: string; img: string; insertada: Date; tag: Object; text: string  }

export interface CardId extends Article { id: string; }
export interface Users { nombre: string, email: string, favoritos: Object }


@Component({
  selector: 'app-inspirasjon',
  templateUrl: './inspirasjon.page.html',
  styleUrls: ['./inspirasjon.page.scss'],
})
export class InspirasjonPage implements OnInit {

  public folder: string;
  searchTerm: string = "";
  public items: any;
  tag:any;

  public favoritos = [];


  private cardCollection: AngularFirestoreCollection<Article>;

  //cards: Observable<CardId[]>;
  private userCollection: AngularFirestoreCollection<Users>;
  user:Observable<Users>;

  noticias: Observable<CardId[]>;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
     private dataService: DataService ,
     private storage: Storage, 
     private afs: AngularFirestore,
     public dataLocalService: DataLocalService,
     private navParamService: NavparamService,
     private router: Router,
     ) {

      this.cardCollection = this.afs.collection<Article>('articulos');
      this.userCollection = this.afs.collection<Users>('Users');

      }
leerTags() {
        this.firestoreService.consultar("tags").subscribe( (data) => {
          this.tag = data;
        })
    
      }
    leerNoticias() {
      this.noticias = this.cardCollection.snapshotChanges().pipe(
        map(actions => actions.map( a=> {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
          return { id, ...data}
        }))
      );
    }


  ngOnInit() {

    this.leerTags();
    this.leerNoticias();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

  }



  // En esta función deberiamos filtrar con el searchbar los articulos que han salido.
  
  filtrarArticulos(event) {

    
    this.searchTerm = event.detail.value;
    console.log(this.searchTerm);
     

  }


  filtrarTag(event) {

    this.noticias = this.afs.collection('articulos', ref=>
    ref.where('tag','array-contains',event))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map( a=> {
        const data = a.payload.doc.data() as Article;
        const id = a.payload.doc.id;
        return { id, ...data}
      }))
    );

  }


  clickFav(item) {
   
    this.dataLocalService.guardarNoticia(item);

  }

  
  gotoNoticia(noticia: Article) {

    this.navParamService.setNavData(noticia);
    this.router.navigate(['details/Inspirasjon'])

  }

}
