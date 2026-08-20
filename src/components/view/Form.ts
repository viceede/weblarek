import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IFormActions } from '../../types';
import { IForm } from '../../types';

export class Form<T> extends Component<IForm & T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement, actions: IFormActions) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;

      if(target && target.name) {
        const field = target.name;
        const value = target.value;
        const formName = this.container instanceof HTMLFormElement ? this.container.name : 'form';

        this.events.emit(`${formName}.${field}:change`, {field, value});
      }
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
    })
    this.container.addEventListener('submit', actions.onSubmit);
  }

  set errorText(value: string) {
    this.errorElement.textContent = String(value);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  clearError() {
    this.errorElement.textContent = '';
  }
}