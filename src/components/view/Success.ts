import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected closeButton: HTMLButtonElement;
  protected totalElement: HTMLElement;
  constructor(protected events: IEvents, container: HTMLElement) {
  super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success-modal:close')
    });
  }
    
  set total(value: number) {
		this.totalElement.textContent = `Списано ${value} синапсов`;
	}

}