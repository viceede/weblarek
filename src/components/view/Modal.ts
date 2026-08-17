import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  private closeButton: HTMLButtonElement;
  private modalContent: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit('modal:close');
      }
    })
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  close() {
    this.container.classList.remove("modal_active");
    this.modalContent.replaceChildren();
  }

  open() {
    this.container.classList.add("modal_active");
  }
}