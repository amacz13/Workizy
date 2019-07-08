import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhatsNextPage } from './whats-next';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    WhatsNextPage,
  ],
  imports: [
    IonicPageModule.forChild(WhatsNextPage),
    TranslateModule,
  ],
})
export class WhatsNextPageModule {}
