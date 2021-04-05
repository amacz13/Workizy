import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ToDoPageRoutingModule } from './to-do-routing.module';

import { ToDoPage } from './to-do.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ToDoPageRoutingModule,
        TranslateModule
    ],
  declarations: [ToDoPage]
})
export class ToDoPageModule {}
