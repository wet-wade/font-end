import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { Group } from 'src/app/shared/models/group';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent implements OnInit {
  group: Group;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private groupSandbox: GroupSandbox
  ) {}

  share() {}

  remove() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.groupId;
    this.groupSandbox.getGroup(id).subscribe((group) => {
      this.group = group;
    });
  }
}
