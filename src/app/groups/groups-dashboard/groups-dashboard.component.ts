import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { Group, GroupSummary } from 'src/app/shared/models/group';

const MOCK_GROUPS: GroupSummary[] = [
  { id: '1', name: 'Apartament Centru', creatorId: 'some-id' },
  { id: '2', name: 'Acasa Suceava', creatorId: 'first-user' },
];

@Component({
  selector: 'app-groups-dashboard',
  templateUrl: './groups-dashboard.component.html',
  styleUrls: ['./groups-dashboard.component.scss'],
})
export class GroupsDashboardComponent implements OnInit {
  groups: GroupSummary[] = [];
  isVisitor = true;
  constructor(
    public authService: AuthService,
    private router: Router,
    private groupSandbox: GroupSandbox
  ) {}

  selectGroup(group: GroupSummary) {
    const id = group.id;
    const url = `/groups/${id}/devices`;
    this.router.navigateByUrl(url);
  }

  createGroup() {
    console.log('create group');
  }

  ngOnInit(): void {
    const isAuthenticated = this.authService.isAuthenticated;
    this.isVisitor = isAuthenticated && !this.authService.user.value.username;
    this.groupSandbox.getGroups().subscribe((groups) => (this.groups = groups));
  }
}
