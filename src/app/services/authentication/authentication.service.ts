import { Injectable } from '@angular/core';
import { Parse } from 'parse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  login(email: string, password: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let user = await Parse.User.logIn(email, password, { usePost: true });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  async register(email: string, password: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let user = new Parse.User();
      user.set("username", email);
      user.set("email", email);
      user.set("password", password);
      try {
        await user.signUp();
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}
