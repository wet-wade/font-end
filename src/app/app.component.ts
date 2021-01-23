import { Component, OnInit } from '@angular/core';
import { ModalBuilder, ModalFactory } from './shared/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private modalFactory: ModalFactory) {}
  title = 'wet-wade';

  ngOnInit() {
    const config = new ModalBuilder()
      .setTitle('Hello')
      .setContent("Testing the modal, we're gonna need this later")
      .setNeutralButton('Ok, good job')
      .create();

    console.log('creating modal');
    this.modalFactory.createModal(config).then((result) => {
      console.log(result);
    });
  }
}
