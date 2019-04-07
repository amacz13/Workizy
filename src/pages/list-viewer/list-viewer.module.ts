import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListViewerPage } from './list-viewer';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ListViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(ListViewerPage),
    TranslateModule.forChild()
  ],
})
export class ListViewerPageModule {}
