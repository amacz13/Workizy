import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListViewerPageRoutingModule } from './list-viewer-routing.module';

import { ListViewerPage } from './list-viewer.page';
import {WelcomePageModule} from '../main/welcome/welcome.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListViewerPageRoutingModule,
        WelcomePageModule,
        TranslateModule
    ],
  declarations: [ListViewerPage]
})
export class ListViewerPageModule {}
