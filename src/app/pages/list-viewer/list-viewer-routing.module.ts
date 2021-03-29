import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListViewerPage } from './list-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: ListViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListViewerPageRoutingModule {}
