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
    path: 'welcome',
    loadChildren: () => import('./pages/main/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'to-do',
    loadChildren: () => import('./pages/main/to-do/to-do.module').then( m => m.ToDoPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/main/search/search.module').then( m => m.SearchPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
