import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'groups',
    loadChildren: () =>
      import('./groups/groups.module').then((m) => m.GroupsModule),
  },
  {
    path: 'groups/:groupId/devices',
    loadChildren: () =>
      import('./devices/devices.module').then((m) => m.DevicesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: 'groups' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
