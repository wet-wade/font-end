import { ComponentRef } from '@angular/core';

interface ModalButtons {
  positive?: string;
  negative?: string;
  neutral?: string;
}

export enum ModalEventType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  DISMISS = 'dismiss',
}

export interface ResolutionObject {
  eventType: ModalEventType;
  [key: string]: any;
}

export type ModalResolution = ModalEventType | ResolutionObject;

export type ModalEventHandler = (
  resolution: ModalResolution,
  componentInstance: ComponentRef<any>,
) => boolean | Promise<boolean>;

export interface ModalConfig {
  title?: string;
  buttons: ModalButtons;
  content: any;
  size?: 'xl' | 'lg' | 'sm';
  dismissable?: boolean;
  data?: any;
  eventHandler?: ModalEventHandler;
  backgroundClass?: string;
  modalModel?: any;
}
