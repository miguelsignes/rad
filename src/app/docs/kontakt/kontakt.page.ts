import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase/app";


import { Storage } from '@ionic/storage';
import { Article } from './../../interfaces/interfaces';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';
@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.page.html',
  styleUrls: ['./kontakt.page.scss'],
})
export class KontaktPage implements OnInit {

  private cardCollection: AngularFirestoreCollection<Article>;
  imgSrc:String = '../../../assets/images/paris.jpg';
  
  noticias: Article[] = [];
  data:any;

  constructor(private afs:AngularFirestore) { 
    this.cardCollection = this.afs.collection<Article>('articulos/', ref=>
       ref.where('categoria', '==', 'Dokumentasjon').limit(1)  
    );
  }

  ngOnInit() {
    this.cargarDoc()
  }

  cargarDoc() {

    this.cardCollection.snapshotChanges().pipe(
      map(actions => actions.map( a=> {
        const data = a.payload.doc.data() as Article;
        const id = a.payload.doc.id;
    
        return { id, ...data}
      }))
    ).subscribe( (data) => {
      console.log(data);
      this.data = data;
    })
  }


}