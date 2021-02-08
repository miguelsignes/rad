import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../usuario.service';
import {  NavController } from '@ionic/angular';
import { DataLocalService } from './../../servicios/data-local.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  unsubscribe:any;

  constructor(private usuarioService: UsuarioService, private navCtrl: NavController, public dataLocalService: DataLocalService, private afs:AngularFirestore) { }

  ngOnInit() {
  }

  ionViewDidLeave	() {
    console.log('ondetrsoy')
    this.unsubscribe()
  }

 logout() {
 //   this.usuarioService.removeStorage()

  this.unsubscribe = this.afs.collection("dataSaved").ref.onSnapshot( (data) =>{
    console.log(data)
  })

  this.usuarioService.logout();


  //this.dataLocalService.removeListener()
  //this.navCtrl.navigateRoot('/', { animated: true})
  console.log('OK')
 
  
  }

}
