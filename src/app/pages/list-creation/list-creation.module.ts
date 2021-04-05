import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCreationPageRoutingModule } from './list-creation-routing.module';

import { ListCreationPage } from './list-creation.page';
import {WelcomePageModule} from '../main/welcome/welcome.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListCreationPageRoutingModule,
        WelcomePageModule,
        TranslateModule
    ],
  declarations: [ListCreationPage]
})
export class ListCreationPageModule {}
