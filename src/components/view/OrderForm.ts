import { ensureElement, ensureAllElements } from '../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IFormActions } from '../../types'
import { TPayment } from '../../types';

interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: HTMLButtonElement[];

  constructor(protected events: IEvents, container: HTMLFormElement, actions: IFormActions) {
    super(events, container, actions);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const paymentValue = button.name as TPayment;

        this.selectPayment(paymentValue);

        this.events.emit<{ field: keyof IOrderForm; value: TPayment }>('order.payment:change', {
          field: 'payment',
          value: paymentValue,
        });
      })
    })
  }

  selectPayment(name: TPayment | null) {
    const buttons = this.paymentButtons;
    buttons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === name);
    })
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}