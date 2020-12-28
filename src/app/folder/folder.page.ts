import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

// FIREBASE SERVICE 
import { FirestoreService } from '../servicios/firestore.service';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';

//SEARCH BAR DATA SERVICE
import { DataService } from '../servicios/data.service';

// IONIC STORAGE
import { Storage } from '@ionic/storage';

import { Article } from '../interfaces/interfaces';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable  } from 'rxjs';
import { map } from 'rxjs/operators';
import { concat, interval, range } from 'rxjs';
import { DataLocalService } from '../servicios/data-local.service';
import { NavparamService } from '../navparam.service';


//export interface Card { title: string; texto: string; categoria: string; img: string; insertada: Date; tag: Object; text: string  }
export interface CardId extends Article { id: string; }


export interface Users { nombre: string, email: string, favoritos: Object }



@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public folder: string;
  public searchTerm: string = "";
  public items: any;
  tag:any = [];

  public favoritos = [];


  private cardCollection: AngularFirestoreCollection<Article>;

  //cards: Observable<CardId[]>;
  private userCollection: AngularFirestoreCollection<Users>;
  user:Observable<Users>;

  noticias: Observable<CardId[]>;
  noticiaFav: Article[] = [];
 //5 noticiaFav: Observable<CardId[]>;
  estrella = 'bookmark-outline';

  articlesRef: any;
  private _data: BehaviorSubject<Article[]>;
  public data: Observable<Article[]>;
  latestEntry: any;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
     private dataService: DataService ,
     private storage: Storage, 
     private afs: AngularFirestore,
     public dataLocalService: DataLocalService,
     private navParamService: NavparamService,
     private router: Router,

     ) {
   
/*
    this.cardCollection = this.afs.collection<Article>('articulos/', ref=>{
      return ref.where('categoria', '==', 'Kommuner/fylkeskommuner')
    });
    */
    this.userCollection = this.afs.collection<Users>('Users');
    
    this.cardCollection = this.afs.collection<Article>('articulos/', ref=> {
      return ref.where('categoria', '==', 'Kommuner/fylkeskommuner')
    });
  
   }
/*
   getArticles() {
     let ref = this.afs.collection<Article>('articulos/', ref=> {
      return ref.where('categoria', '==', 'Kommuner/fylkeskommuner').limit(4).get()
      .then( (snap) => {
        this.start = snap.docs[snap.docs.length - 1]
   
      });
     })



    }
*/


leerTags() {
  /*
  this.firestoreService.consultar("articulos/tag").subscribe( (data) => {
    this.tag = data;
  })
  */
 this.cardCollection.snapshotChanges().pipe(
    map(actions => actions.map( a=> {
      const data = a.payload.doc.data() as Article;
      const tag = a.payload.doc.data().tag;
    
      return { tag }
    }))
  ).subscribe((data) => {
    
    data.map( (data)=> {
   
      console.log('tag?', data.tag);
   
      data.tag.map( (v) => {

        this.tag.push(v);


      })
      console.log('this.tag', this.tag);
      const uniqueSet = new Set(this.tag);
      this.tag = [...uniqueSet];
   })
    
  });
    }
  
  async cargarFavoritos() {
    const favoritos = await this.storage.get('favoritos');
           if ( favoritos) {
            this.noticiaFav = favoritos;
     }
  
  }

  async existeArticulo(id:string) {
       await this.cargarFavoritos();
    const existe = this.noticiaFav.find( noti => noti.id === id );
     return (existe)? true : false;
  }
 


filtrarFav() {

   // this.noticiaFav.
   // let filtro = this.noticiaFav.
  }
  
//leerNoticias() {
  //this.noticias = this.cardCollection.snapshotChanges()
  getCollection(ref, queryFn?): Observable<any[]> {
  return this.afs.collection(ref, queryFn).snapshotChanges()
  
  .pipe(
    map(actions => actions.map( a => {

      const data = a.payload.doc.data() as Article;
      const id = a.payload.doc.id;
      //const doc = a.payload.doc;
      return { id, ...data}
      
    })
    )

  )
}

first() {
  this._data = new BehaviorSubject([]);
  this.data = this._data.asObservable();

  const articulosRef = this.getCollection('articulos/', ref=> 
    ref.where('categoria', '==', 'Kommuner/fylkeskommuner')
  ).subscribe( data => {
    this.latestEntry = data[data.length -1].doc;
    this._data.next(data);
  });
  

}
next(event) {

  setTimeout( ()=> {
    const articulosRef = this.getCollection('articulos', ref=>
       ref.where('categoria', '==', 'Kommuner/fylkeskommuner').startAfter(this.latestEntry).limit(10)
    ).subscribe( data => {
      if (data.length) {
        console.log(data);
        this.latestEntry = data[data.length - 1].doc;
        this._data.next(data)
      }
    })
    this.infiniteScroll.complete()
  }, 1500)


   
       

}


  /*

 leerNoticias() {
      let fav = false;
     
      this.noticias = this.cardCollection.snapshotChanges()
       .pipe(
        map(actions => actions.map( a => {

      
          const data = a.payload.doc.data() as Article;
          const id = a.payload.doc.id;
         
          return {id, ...data} 
          
        })
        )

      );

    }
    
*/

  ngOnInit() {

    this.cargarFavoritos()
    this.leerTags();
    this.filtrarArticulos();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.first()
   // this.leerNoticias()


  }



  // En esta función deberiamos filtrar con el searchbar los articulos que han salido.

  // Search Bar Implementador de busquedas o Filtro
  
  filtrarArticulos() {
    this.items = this.dataService.filtrarItems(this.searchTerm);
  }

 

  clickFav(item) {
    
    this.dataLocalService.guardarNoticia(item);
    
  }


  gotoNoticia(noticia: Article) {

        this.navParamService.setNavData(noticia);
        this.router.navigate(['details/Kommuner'])
    
      }

      filtrarTag(event) {

        const exits = this.tag.includes('Reset');
       // console.log(exits);
       //this.tag.push('Reset');
       //  this.tag = this.tag.splice(this.tag.indexOf('Reset',1));
        if (exits) {
         // this.tag = this.tag.splice(this.tag.indexOf('Reset',1));
          this.tag = this.tag.slice(0, this.tag.length -1);
        }
        if (event != 'Reset') {
          this.tag.push('Reset');
          //this.tag = this.tag.splice(this.tag.indexOf('Reset',1));
        }
        if ( event == 'Reset' ) {
                    
        // this.tag = this.tag.slice(0, this.tag.length -1);
       this.data = this.afs.collection('articulos', ref => 
           ref.where('categoria', '==', 'Kommuner/fylkeskommuner')
         ).snapshotChanges()
         .pipe(
          map(actions => actions.map( a=> {
            const data = a.payload.doc.data() as Article;
            const id = a.payload.doc.id;
            return { id, ...data}
          }))
          
        )
        } else { 
        this.data = this.afs.collection('articulos', ref =>
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
      }
    

}
