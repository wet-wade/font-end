import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { GroupSandbox } from 'src/app/shared/group.sandbox';
import {
  ModalBuilder,
  ModalEventType,
  ModalFactory,
} from 'src/app/shared/modal';
import { GroupSummary } from 'src/app/shared/models/group';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss'],
})
export class JoinGroupComponent implements OnInit {
  @ViewChild('nameForm', { static: true }) nameForm: TemplateRef<any>;
  public formGroup: FormGroup;
  public group: GroupSummary;

  constructor(
    public authService: AuthService,
    private groupSandbox: GroupSandbox,
    private modalFactory: ModalFactory,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async handleJoin(resolution: ModalEventType): Promise<boolean> {
    if (this.authService.isAuthenticated) {
      await this.groupSandbox.joinGroup(this.group.id).toPromise();
    } else {
      const name = this.formGroup.value.name;
      if (!name) {
        return false;
      }
      await this.groupSandbox
        .joinGroupAsVisitor(this.group.id, name)
        .toPromise();
    }

    this.router.navigateByUrl('/');
    return true;
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
    const groupId = this.activatedRoute.snapshot.params.groupId;

    this.group = await this.groupSandbox.getGroupSummary(groupId).toPromise();
    await this.authService.authToken();

    const modalConfig = new ModalBuilder()
      .setContent(this.nameForm)
      .setTitle('Join group ' + this.group.name)
      .setDismissable(false)
      .setPositiveButton('Join')
      .setEventHandler(this.handleJoin.bind(this))
      .create();

    this.modalFactory.createModal(modalConfig);
  }
}
