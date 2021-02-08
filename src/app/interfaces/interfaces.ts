export interface Article {
  id: string;
  title: string;
  insertada: Insertada;
  img: string;
  categoria: string;
  texto: string;
  tag: Tag[];
  fav: boolean;
  alt?:string;
  desc?: string;
  video?:string;
}

export interface Insertada {
  seconds: number;
  nanoseconds: number;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Usuario {
  avatar?: string;
  _id?: string;
  nombre?: string;
  email?: string;
  password?: string;
}

