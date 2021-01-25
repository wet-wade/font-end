import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsDashboardComponent } from './groups-dashboard/groups-dashboard.component';
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  declarations: [GroupsDashboardComponent],
  imports: [CommonModule, GroupsRoutingModule],
})
export class GroupsModule {}
