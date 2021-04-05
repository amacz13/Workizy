import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  password: string;
  email: string;

  constructor(private authenticationService: AuthenticationService, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    this.authenticationService.login(this.email,this.password).then( user => {
      console.log('User : ',user);
      loading.dismiss();
    }).catch(error => {
      console.log('Error : ',error);
      loading.dismiss();
    });
  }

  async register() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    this.authenticationService.register(this.email,this.password).then( user => {
      console.log('User : ',user);
      loading.dismiss();
    }).catch(error => {
      console.log('Error : ',error);
      loading.dismiss();
    });
  }
}
