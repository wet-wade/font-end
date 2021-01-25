import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from '../shared/auth.guard';
import { GroupsDashboardComponent } from './groups-dashboard/groups-dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: GroupsDashboardComponent,
    canActivate: [AuthCanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
