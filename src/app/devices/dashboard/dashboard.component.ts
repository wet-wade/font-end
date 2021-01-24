import { Component, OnInit } from '@angular/core';
import { Device, DeviceStatus, DeviceType } from 'src/app/shared/models/device';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [
    {
      id: 'device-1',
      name: 'Bec in sufragerie',
      type: DeviceType.LIGHTBULD,
      status: DeviceStatus.ON,
      available: true,
    },
    {
      id: 'device-2',
      name: 'AC in dormitor',
      type: DeviceType.HVAC,
      status: DeviceStatus.ON,
      available: true,
      data: { temperature: 22 },
    },
    {
      id: 'device-3',
      name: 'Usa la balcon',
      type: DeviceType.DOOR,
      status: DeviceStatus.OFF,
      available: true,
      data: { locked: false },
    },
    {
      id: 'device-4',
      name: 'Priza dormitor',
      type: DeviceType.OUTLET,
      status: DeviceStatus.ON,
      available: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
