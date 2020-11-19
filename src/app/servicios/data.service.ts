import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public items: any = [];
  constructor() { }

  

  filtrarItems(searchTerm) {
    return this.items.filter( item=> {
      return item.texto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
