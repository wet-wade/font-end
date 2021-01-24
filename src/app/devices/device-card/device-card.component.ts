import { Component, Input, OnInit } from '@angular/core';
import { DeviceStatus, DeviceType } from 'src/app/shared/models/device';

const ICONS = {
  [DeviceType.DOOR]: 'assets/icons/door.svg',
  [DeviceType.LIGHTBULD]: 'assets/icons/lightbulb.svg',
  [DeviceType.OUTLET]: 'assets/icons/outlet.svg',
  [DeviceType.HVAC]: 'assets/icons/temperature.svg',
};
@Component({
  selector: 'app-device',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss'],
})
export class DeviceComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() available: string;
  @Input() type: DeviceType;
  @Input() data: any;
  @Input() status: DeviceStatus;

  get icon() {
    return ICONS[this.type];
  }

  constructor() {}

  ngOnInit(): void {}
}
