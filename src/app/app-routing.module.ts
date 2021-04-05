import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'first-run',
    loadChildren: () => import('./pages/first-run/first-run/first-run.module').then( m => m.FirstRunPageModule)
  },
  {
    path: 'list-creation',
    loadChildren: () => import('./pages/list-creation/list-creation.module').then( m => m.ListCreationPageModule)
  },
  {
    path: 'list-viewer',
    loadChildren: () => import('./pages/list-viewer/list-viewer.module').then( m => m.ListViewerPageModule)
  },
  {
    path: 'card-creation',
    loadChildren: () => import('./pages/card-creation/card-creation.module').then( m => m.CardCreationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
