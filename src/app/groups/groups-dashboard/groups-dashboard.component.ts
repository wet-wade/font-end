import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import {
  ModalBuilder,
  ModalEventType,
  ModalFactory,
} from 'src/app/shared/modal';
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
  @ViewChild('addGroup', { static: true }) groupModal: TemplateRef<any>;
  groups: GroupSummary[] = [];
  isVisitor = true;

  formGroup: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private groupSandbox: GroupSandbox,
    private modalFactory: ModalFactory
  ) {}

  selectGroup(group: GroupSummary) {
    const id = group.id;
    const url = `/groups/${id}/devices`;
    this.router.navigateByUrl(url);
  }

  createGroup() {
    const config = new ModalBuilder()
      .setTitle('Create a new group')
      .setContent(this.groupModal)
      .setPositiveButton('Create')
      .setDismissable(true)
      .setEventHandler(async (resolution) => {
        if (resolution === ModalEventType.DISMISS) {
          return true;
        }

        const name = this.formGroup.value.name;
        if (!name) {
          return false;
        }

        const group = await this.groupSandbox.createGroup(name).toPromise();
        this.groups.push(group);

        return true;
      })
      .create();

    this.modalFactory.createModal(config);
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    const isAuthenticated = this.authService.isAuthenticated;
    this.isVisitor = isAuthenticated && !this.authService.user.value.username;
    this.groupSandbox.getGroups().subscribe((groups) => (this.groups = groups));
  }
}
