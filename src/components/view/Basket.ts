import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasket {
  fullPrice: number;
  buttonState: boolean;
  basketList: HTMLElement[];
}

export class Basket extends Component<IBasket> {
  private basketListElement: HTMLUListElement;
  private orderButton: HTMLButtonElement;
  private fullPriceElement: HTMLSpanElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.basketListElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.fullPriceElement = ensureElement<HTMLSpanElement>('.basket__price', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:makeOrder');
    });
  }

  set fullPrice(value: number) {
    this.fullPriceElement.textContent = (`${value} синапсов`);
  }

  set basketList(items: HTMLElement[]) {
    this.basketListElement.replaceChildren(...items);
  }

  set buttonState(state: boolean) {
    this.orderButton.disabled = state;
  }
}