import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import {
  Device,
  DeviceCommand,
  DeviceStatus,
  DeviceType,
  SavedDevice,
} from 'src/app/shared/models/device';
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

  temperature: number;

  permissions: (DevicePermission & { member: GroupMember })[];
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
    this.permissions = this.group.permissions
      .filter((other) => other.deviceId === deviceId)
      .map((permission) => ({
        ...permission,
        member: this.group.members.find(
          (other) => other.id === permission.memberId
        ),
      }));

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

  toggleManage(memberId: string) {
    const permission = this.permissions.find(
      (other) => other.memberId === memberId
    );
    permission.manage = !permission.manage;
    this.groupSandbox
      .setPermissions(this.group.id, permission)
      .subscribe(() => {});
  }

  toggleRead(memberId: string) {
    const permission = this.permissions.find(
      (other) => other.memberId === memberId
    );
    permission.read = !permission.read;
    this.groupSandbox
      .setPermissions(this.group.id, permission)
      .subscribe(() => {});
  }
  toggleWrite(memberId: string) {
    const permission = this.permissions.find(
      (other) => other.memberId === memberId
    );
    permission.write = !permission.write;
    this.groupSandbox
      .setPermissions(this.group.id, permission)
      .subscribe(() => {});
  }

  togglePower() {
    const command =
      this.device.status === DeviceStatus.ON
        ? DeviceCommand.OFF
        : DeviceCommand.ON;
    this.groupSandbox
      .controlDevice(this.group.id, this.device.id, command, {})
      .subscribe((device) => (this.device = device));
  }

  updateTemperature() {
    const command = DeviceCommand.SET_TEMPERATURE;
    this.groupSandbox
      .controlDevice(this.group.id, this.device.id, command, {
        temperature: this.device.data.temperature,
      })
      .subscribe((device) => (this.device = device));
  }

  toggleLock() {
    const command = this.device.data.locked
      ? DeviceCommand.UNLOCK
      : DeviceCommand.LOCK;
    this.groupSandbox
      .controlDevice(this.group.id, this.device.id, command, {})
      .subscribe((device) => (this.device = device));
  }
}
