import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig, ModalEventType, ModalResolution } from '../interfaces';
import { ModalContentDirective } from '../modal-content/modal-content.directive';

export class ModalContentComponent {
  /** trigger specified modal event */
  action: (type: ModalResolution) => Promise<void> = () => Promise.resolve();
}

@Component({
  selector: 'app-main-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @ViewChild(ModalContentDirective, { static: true })
  contentHost: ModalContentDirective;
  @Input() cfg: ModalConfig;
  @Input() onClose: (resolution: ModalResolution) => void;
  ModalEventType = ModalEventType;

  activeComponent: ComponentRef<any> = null;

  objectKeys = Object.keys;
  typeOf(content) {
    return typeof content;
  }

  constructor(
    public activeModal: NgbActiveModal,
    public componentFactoryResolver: ComponentFactoryResolver,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof this.cfg.content === 'string') {
      return;
    }
    const viewContainer = this.contentHost.viewContainerRef;
    viewContainer.clear();
    if (this.cfg.content instanceof TemplateRef) {
      viewContainer.createEmbeddedView(this.cfg.content);
    } else if (this.cfg.content) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.cfg.content
      );
      const componentRef = viewContainer.createComponent(componentFactory);

      // if the component extends the `ModalContentComponent` class, which gives access to modal actions
      // link the component instance action method to the actual action method (present in this component)
      if (componentRef.instance instanceof ModalContentComponent) {
        componentRef.instance.action = (resolution) => this.action(resolution);
      }
      this.activeComponent = componentRef;
      if (this.cfg.data) {
        Object.assign(componentRef.instance, this.cfg.data);
      }
    }
  }

  async action(resolution: ModalResolution) {
    if (this.cfg.eventHandler) {
      let result = this.cfg.eventHandler(resolution, this.activeComponent);
      if (result instanceof Promise) {
        result = await result;
      }
      if (result) {
        this.onClose(resolution);
        this.activeModal.close();
      }
    } else {
      this.onClose(resolution);
      this.activeModal.close();
    }
  }
}
