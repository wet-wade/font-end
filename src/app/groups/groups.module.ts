import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsDashboardComponent } from './groups-dashboard/groups-dashboard.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [GroupsDashboardComponent],
  imports: [CommonModule, GroupsRoutingModule, SharedModule],
})
export class GroupsModule {}
