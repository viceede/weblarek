import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { ICardActions } from '../../types';

interface ICardPreview {
  category: string;
  image: string;
  description: string;
  buttonText: string,
  buttonDisabled: boolean
}

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICardPreview> {
  protected categoryElement: HTMLSpanElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLParagraphElement;
  protected buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container)
    this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buyButton.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  
    for(const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
  
  set image(value: string){
    this.setImage(this.imageElement, value, this.title);
  }

  set buttonText(value: string) {
    if(this.buyButton) {
      this.buyButton.textContent = value;
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buyButton.disabled = value;
  }
}