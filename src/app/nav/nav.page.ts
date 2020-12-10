import { Component, OnInit, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// FIREBASE SERVICE
import { FirestoreService } from '../servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

//SEARCH BAR DATA SERVICE
import { DataService } from '../servicios/data.service';

// IONIC STORAGE
import { Storage } from '@ionic/storage';

import { Article } from '../interfaces/interfaces';

import { Observable  } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataLocalService } from '../servicios/data-local.service';
import { NavparamService } from '../navparam.service';
import { Router } from '@angular/router';
//export interface Card { title: string; texto: string; categoria: string; img: string; insertada: Date; tag: Object; text: string  }
export interface CardId extends Article { id: string; }


export interface Users { nombre: string, email: string, favoritos: Object }



@Component({
  selector: 'app-nav',
  templateUrl: './nav.page.html',
  styleUrls: ['./nav.page.scss'],
})
export class NavPage implements OnInit {

  public folder: string;

  public items: any;
  tag:any;

  public favoritos = [];


  private cardCollection: AngularFirestoreCollection<Article>;

  //cards: Observable<CardId[]>;
  private userCollection: AngularFirestoreCollection<Users>;
  user:Observable<Users>;

  noticias: Observable<CardId[]>;
  noticiaFav: Article[] = [];
 //5 noticiaFav: Observable<CardId[]>;
  estrella = 'bookmark-outline';
  searchTerm: string = "";

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
     private dataService: DataService ,
     private storage: Storage, 
     private afs: AngularFirestore,
     public dataLocalService: DataLocalService,
     private navParamService: NavparamService,
     private router: Router,

     ) {
   

      this.cardCollection = this.afs.collection<Article>('articulos/', ref=>{
        return ref.where('categoria', '==', 'NAV')
      });
    this.userCollection = this.afs.collection<Users>('Users');
   
   }

  leerTags() {
    this.firestoreService.consultar("tags").subscribe( (data) => {
      this.tag = data;
    })

  }
  
  async cargarFavoritos() {
    const favoritos = await this.storage.get('favoritos');
           if ( favoritos) {
            this.noticiaFav = favoritos;
     }
  
  }

  async existeArticulo(id:string) {
       await this.cargarFavoritos();
//    const existe = this.noticiaFav.find( noti => noti.id === id );
  //   return (existe)? true : false;
  }
 



 leerNoticias() {
      let fav = false;
      this.noticias = this.cardCollection.snapshotChanges().pipe(
        map(actions => actions.map( a => {
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
         
   //      this.existeArticulo(id)
     //    .then ( existe => fav = true )
        //    .then( existe => this.estrella = (existe) ? 'bookmark' : 'bookmark-outline');

          //const fav = true;

            return {id, ...data} 
          
        }))

      );

    }
    


  ngOnInit() {

    this.cargarFavoritos()
    this.leerTags();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.leerNoticias()
 

  }



  // En esta función deberiamos filtrar con el searchbar los articulos que han salido.

  // Search Bar Implementador de busquedas o Filtro
  
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
        this.router.navigate(['details/nav'])
    
      }

}
