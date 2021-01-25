import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
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
  groups: GroupSummary[] = MOCK_GROUPS;

  constructor(public authService: AuthService, private router: Router) {}

  selectGroup(group: GroupSummary) {
    const id = group.id;
    const url = `/groups/${id}/devices`;
    this.router.navigateByUrl(url);
  }

  createGroup() {
    console.log('create group');
  }

  ngOnInit(): void {}
}
