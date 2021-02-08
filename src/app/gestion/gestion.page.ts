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
import { NavparamService } from '../navparam.service';
import { Router } from '@angular/router';


//export interface Card { title: string; texto: string; categoria: string; img: string; insertada: Date; tag: Object; text: string  }
export interface CardId extends Article { id: string; }


export interface Users { nombre: string, email: string, favoritos: Object }


@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {

  public folder: string;
  searchTerm: string = "";
  public items: any;
  tag:any = [];
  public favoritos = [];


  private cardCollection: AngularFirestoreCollection<Article>;

  //cards: Observable<CardId[]>;

  noticias: Observable<CardId[]>;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
     private dataService: DataService ,
     private storage: Storage, 
     private afs: AngularFirestore,
     public dataLocalService: DataLocalService,
     private navParamService: NavparamService,
     private router: Router,
     ) {

      this.cardCollection = this.afs.collection<Article>('articulos/', ref=>{
        return ref.where('categoria', '==', 'Helseforetak')
      });
     

      }
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
         
        //    console.log('tag?', data.tag);
         
            data.tag.map( (v) => {

              this.tag.push(v);


            })
     //       console.log('this.tag', this.tag);
            const uniqueSet = new Set(this.tag);
            this.tag = [...uniqueSet];
         })
          
        });
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
   this.noticias = this.afs.collection('articulos', ref => 
       ref.where('categoria', '==', 'Helseforetak')
     ).snapshotChanges()
     .pipe(
      map(actions => actions.map( a=> {
        const data = a.payload.doc.data() as Article;
        const id = a.payload.doc.id;
        return { id, ...data}
      }))
      
    )
    } else { 
    this.noticias = this.afs.collection('articulos', ref =>
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



  gotoNoticia(noticia: Article) {

    this.navParamService.setNavData(noticia);
    console.log(noticia);
    this.router.navigate(['details/Helseteforak'])

  }
}
