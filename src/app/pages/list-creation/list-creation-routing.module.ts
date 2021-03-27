import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCreationPage } from './list-creation.page';

const routes: Routes = [
  {
    path: '',
    component: ListCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCreationPageRoutingModule {}
