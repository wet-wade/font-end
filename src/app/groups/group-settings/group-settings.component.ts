import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import { ModalBuilder, ModalFactory } from 'src/app/shared/modal';
import { Group } from 'src/app/shared/models/group';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent implements OnInit {
  @ViewChild('shareModal', { static: true }) shareModal: TemplateRef<any>;
  group: Group;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private groupSandbox: GroupSandbox,
    private modalFactory: ModalFactory
  ) {}

  share() {
    const config = new ModalBuilder()
      .setContent(this.shareModal)
      .setDismissable(true)
      .setTitle('Share group so others can join')
      .create();

    this.modalFactory.createModal(config);
  }

  get link() {
    return `${window.location.host}/groups/${this.group?.id}/join`;
  }

  toClipboard(e) {
    e.target.select();
    navigator.clipboard.writeText(this.link);
  }

  remove() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.groupId;
    this.groupSandbox.getGroup(id).subscribe((group) => {
      this.group = group;
    });
  }
}
