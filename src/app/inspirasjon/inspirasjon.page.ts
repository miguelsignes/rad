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
  public searchTerm: string = "";
  public items: any;
  tag:any = [];

  public favoritos = [];


  private cardCollection: AngularFirestoreCollection<Article>;



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
        return ref.where('categoria', '==', 'Inspirasjon')
      });
   

      }
    
      leerTags() {

       this.cardCollection.snapshotChanges().pipe(
          map(actions => actions.map( a=> {
            const data = a.payload.doc.data() as Article;
            const tag = a.payload.doc.data().tag;
          
            return { tag }
          }))
        ).subscribe((data) => {
          
          data.map( (data)=> {
         
          //  console.log('tag?', data.tag);
         
            data.tag.map( (v) => {

              this.tag.push(v);


            })
   //         console.log('this.tag', this.tag);
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


    this.items = this.dataService.filtrarItems(this.searchTerm);

  }


  filtrarTag(event) {

    const exits = this.tag.includes('Reset');

    if (exits) {
 
      this.tag = this.tag.slice(0, this.tag.length -1);
    }
    if (event != 'Reset') {
      this.tag.push('Reset');
     
    }
    if ( event == 'Reset' ) {

   this.noticias = this.afs.collection('articulos', ref => 
       ref.where('categoria', '==', 'Inspirasjon')
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
    this.router.navigate(['details/Inspirasjon'])

  }

}
