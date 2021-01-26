import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import {
  ModalBuilder,
  ModalEventType,
  ModalFactory,
} from 'src/app/shared/modal';
import { Device } from 'src/app/shared/models/device';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  private groupId: string;
  @ViewChild('setNickname', { static: true }) nicknameForm: TemplateRef<any>;
  formGroup: FormGroup;

  availableDevices: Device[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private groupSandbox: GroupSandbox,
    private modalFactory: ModalFactory
  ) {}

  async addDeviceToGroup(resolution: ModalEventType, device: Device) {
    if (resolution === ModalEventType.DISMISS) {
      return true;
    }

    if (this.formGroup.invalid) {
      return false;
    }
    const nickname = this.formGroup.value.nickname;
    await this.groupSandbox
      .addDevice(this.groupId, device.id, nickname)
      .toPromise();

    this.availableDevices = this.availableDevices.filter(
      (other) => other.id !== device.id
    );

    return true;
  }

  initAddDeviceModal(device: Device) {
    const config = new ModalBuilder()
      .setContent(this.nicknameForm)
      .setDismissable(true)
      .setTitle('Set a nickname for your device')
      .setEventHandler((r: ModalEventType) => this.addDeviceToGroup(r, device))
      .setPositiveButton('Add')
      .create();
    this.modalFactory.createModal(config);
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      nickname: new FormControl('', [Validators.required]),
    });

    this.groupId = this.activatedRoute.snapshot.params.groupId;
    const devices = await this.groupSandbox.discover(this.groupId).toPromise();
    this.availableDevices = devices;
  }
}
