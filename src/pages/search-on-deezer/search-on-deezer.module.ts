import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchOnDeezerPage } from './search-on-deezer';

@NgModule({
  declarations: [
    SearchOnDeezerPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchOnDeezerPage),
  ],
})
export class SearchOnDeezerPageModule {}
