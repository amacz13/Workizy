import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';
import {CardComponent} from '../../../components/card/card.component';
import {LinklistElementComponent} from '../../../components/linklist-element/linklist-element.component';
import {ChecklistElementComponent} from '../../../components/checklist-element/checklist-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule
  ],
    declarations: [WelcomePage, CardComponent, LinklistElementComponent, ChecklistElementComponent]
})
export class WelcomePageModule {}
