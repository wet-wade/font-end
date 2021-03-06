import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from '../shared/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceControlComponent } from './device-control/device-control.component';
import { DiscoverComponent } from './discover/discover.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthCanActivateGuard],
  },
  {
    path: 'discover',
    component: DiscoverComponent,
    canActivate: [AuthCanActivateGuard],
  },
  {
    path: ':deviceId',
    component: DeviceControlComponent,
    canActivate: [AuthCanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
