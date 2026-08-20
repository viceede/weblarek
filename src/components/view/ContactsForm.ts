import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IFormActions } from '../../types';
import { IContactsForm } from '../../types';


export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents, actions: IFormActions) {
    super(events, container, actions);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  set phone(value: string) {
    this.phoneInput.value = value ?? '';
  }

  set email(value: string) {
    this.emailInput.value = value ?? '';
  }

}