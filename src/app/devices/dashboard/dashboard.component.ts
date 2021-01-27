import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { Device, SavedDevice } from 'src/app/shared/models/device';
import { Group } from 'src/app/shared/models/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  devices: SavedDevice[] = [];
  group: Group;
  isOwner = false;
  constructor(
    private groupSandbox: GroupSandbox,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const groupId = this.activatedRoute.snapshot.params.groupId;
    this.groupSandbox.getGroup(groupId).subscribe((group) => {
      this.group = group;
      this.devices = group.devices;
      this.isOwner = this.authService.user.value.id === group.ownerId;
    });
  }
}
