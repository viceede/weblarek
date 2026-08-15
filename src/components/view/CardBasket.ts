import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { ICardActions } from '../../types';

interface ICardBasket {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLSpanElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if(actions?.onClick){
      this.deleteButton.addEventListener('click', actions?.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}