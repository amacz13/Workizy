import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardCreationPageRoutingModule } from './card-creation-routing.module';

import { CardCreationPage } from './card-creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardCreationPageRoutingModule
  ],
  declarations: [CardCreationPage]
})
export class CardCreationPageModule {}
