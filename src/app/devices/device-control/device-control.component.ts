import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { Device, DeviceType, SavedDevice } from 'src/app/shared/models/device';
import { DevicePermission } from 'src/app/shared/models/device-permission';
import { Group } from 'src/app/shared/models/group';
import { GroupMember } from 'src/app/shared/models/user';

const ICONS = {
  [DeviceType.DOOR]: 'assets/icons/door.svg',
  [DeviceType.LIGHTBULD]: 'assets/icons/lightbulb.svg',
  [DeviceType.OUTLET]: 'assets/icons/outlet.svg',
  [DeviceType.HVAC]: 'assets/icons/temperature.svg',
};
@Component({
  selector: 'app-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss'],
})
export class DeviceControlComponent implements OnInit {
  group: Group;
  device: SavedDevice;
  members: GroupMember;

  permissions: DevicePermission[];
  userPermissions: DevicePermission;

  constructor(
    private authService: AuthService,
    private groupSandbox: GroupSandbox,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  get icon() {
    return ICONS[this.device?.type];
  }

  async ngOnInit(): Promise<void> {
    const groupId = this.activatedRoute.snapshot.params.groupId;
    const deviceId = this.activatedRoute.snapshot.params.deviceId;

    this.group = await this.groupSandbox.getGroup(groupId).toPromise();
    this.device = this.group.devices.find((other) => other.id === deviceId);
    this.permissions = this.group.permissions.filter(
      (other) => other.deviceId === deviceId
    );

    this.userPermissions = this.permissions.find(
      (other) => other.memberId === this.authService.user.value.id
    ) || {
      memberId: this.authService.user.value.id,
      deviceId: this.device.id,
      manage: false,
      read: false,
      write: false,
    };
  }

  togglePower() {}

  updateTemperature() {}

  toggleLock() {}
}
