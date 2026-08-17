import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ICard {
  title: string;
  price: number | null;
}

export class Card<T> extends Component<ICard & T> {
  protected cardTitle: HTMLHeadingElement;
  protected cardPrice: HTMLSpanElement;

  constructor(container: HTMLElement){
    super(container);
    this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLHeadingElement>('.card__price', this.container);
  };

  set title(value: string) {
    this.cardTitle.textContent = String(value);
  }

  set price(value: number) {
    this.cardPrice.textContent = value ? `${String(value)} синапсов` : `Бесценно`;
  }
}