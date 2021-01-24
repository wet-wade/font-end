import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent implements OnInit {
  @Input() name: string;
  @Input() type: string;
  @Input() data: any;

  constructor() {}

  ngOnInit(): void {}
}
