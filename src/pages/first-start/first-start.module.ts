import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstStartPage } from './first-start';

@NgModule({
  declarations: [
    FirstStartPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstStartPage),
  ],
})
export class FirstStartPageModule {}
