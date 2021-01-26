import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from '../shared/auth.guard';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { GroupsDashboardComponent } from './groups-dashboard/groups-dashboard.component';
import { JoinGroupComponent } from './join-group/join-group.component';
const routes: Routes = [
  {
    path: '',
    component: GroupsDashboardComponent,
    canActivate: [AuthCanActivateGuard],
  },
  {
    path: ':groupId/settings',
    component: GroupSettingsComponent,
    canActivate: [AuthCanActivateGuard],
  },
  {
    path: ':groupId/join',
    component: JoinGroupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
