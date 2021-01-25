import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface ActionButtonAppearance {
  size: 'sm' | 'md' | 'lg';
  scheme: 'grayscale' | 'blue' | 'pink';
  borderRadius: 'sm' | 'md' | 'lg';
}
@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit {
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() scheme: 'grayscale' | 'blue' | 'pink' = 'blue';
  @Input() borderRadius: 'sm' | 'md' | 'lg' = 'lg';
  @Input() disabled: boolean = false;
  @Output() action = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
