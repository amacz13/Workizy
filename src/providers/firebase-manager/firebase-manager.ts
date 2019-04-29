import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable()
export class FirebaseManager {

  constructor(public afs: AngularFirestore) {
    this.addUser();
  }

  addUser(){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/users').add({
        name: "Toto",
        surname: "Le ptit",
        age: parseInt('32')
      })
        .then(
          (res) => {
            resolve(res)
          },
          err => reject(err)
        )
    })
  }


}
