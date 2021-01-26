import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { Device, DeviceStatus, DeviceType } from 'src/app/shared/models/device';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [];

  constructor(
    private groupSandbox: GroupSandbox,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const groupId = this.activatedRoute.snapshot.params.groupId;
    this.groupSandbox
      .getGroup(groupId)
      .subscribe((group) => (this.devices = group.devices));
  }
}
