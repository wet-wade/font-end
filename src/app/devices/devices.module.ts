import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { DeviceComponent } from './device-card/device-card.component';
import { DiscoverComponent } from './discover/discover.component';
import { DeviceControlComponent } from './device-control/device-control.component';

@NgModule({
  declarations: [DashboardComponent, DeviceComponent, DiscoverComponent, DeviceControlComponent],
  imports: [SharedModule, DevicesRoutingModule],
  providers: [],
})
export class DevicesModule {}
