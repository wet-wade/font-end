import { Component, OnInit } from '@angular/core';

export interface IoTDevice {
  name: string;
  type: string;
  data: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  devices: IoTDevice[] = [{ name: 'Bec', type: 'Bec', data: { power: true } }];

  constructor() {}

  ngOnInit(): void {}
}
