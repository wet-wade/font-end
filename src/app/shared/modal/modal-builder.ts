import { ModalConfig, ModalEventHandler } from './interfaces';

export class ModalBuilder {
  config: ModalConfig;
  constructor() {
    this.config = {
      content: '',
      dismissable: false,
      buttons: {},
    };
  }

  setTitle(title: string): ModalBuilder {
    this.config.title = title;
    return this;
  }

  setContent(content): ModalBuilder {
    this.config.content = content;
    return this;
  }

  setPositiveButton(label: string): ModalBuilder {
    this.config.buttons.positive = label;
    return this;
  }

  setNeutralButton(label: string): ModalBuilder {
    this.config.buttons.neutral = label;
    return this;
  }

  setNegativeButton(label: string): ModalBuilder {
    this.config.buttons.negative = label;
    return this;
  }

  setDismissable(dismissable: boolean): ModalBuilder {
    this.config.dismissable = dismissable;
    return this;
  }

  setSize(size: 'xl' | 'lg' | 'sm'): ModalBuilder {
    this.config.size = size;
    return this;
  }

  setBackgroundClass(backgroundClass: string): ModalBuilder {
    this.config.backgroundClass = backgroundClass;
    return this;
  }

  setData(data): ModalBuilder {
    this.config.data = data;
    return this;
  }

  setEventHandler(handler: ModalEventHandler): ModalBuilder {
    this.config.eventHandler = handler;
    return this;
  }

  create(): ModalConfig {
    return this.config;
  }
}
