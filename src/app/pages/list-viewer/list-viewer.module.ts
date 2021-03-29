import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListViewerPageRoutingModule } from './list-viewer-routing.module';

import { ListViewerPage } from './list-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListViewerPageRoutingModule
  ],
  declarations: [ListViewerPage]
})
export class ListViewerPageModule {}
