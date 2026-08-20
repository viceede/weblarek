/* Импорты, создание переменных и экземпляров классов */

//импортирование стилей
import './scss/styles.scss';
//импортирование утилит
import { ensureElement, cloneTemplate } from '../src/utils/utils.ts'
//импортирование компонентов API
import { Api } from './components/base/Api.ts';
import { AppApi } from "./components/communication/AppApi.ts";
import { API_URL } from './utils/constants.ts';
//импортирование брокера событий
import { EventEmitter } from './components/base/Events.ts'
//импортирование константы CDN_URL
import { CDN_URL } from './utils/constants.ts';
//импортирование моделей данных
import {Customer} from "./components/Models/Customer.ts";
import {MainCatalog} from "./components/Models/MainCatalog.ts";
import {ProductsCart} from "./components/Models/ProductsCart.ts";
//импортирование классов представления
import { Gallery } from './components/view/Gallery.ts';
import { Header } from './components/view/Header.ts';
import { Modal } from './components/view/Modal.ts';
import { Success } from './components/view/Success.ts';
import { Basket } from './components/view/Basket.ts';
import { CardBasket } from './components/view/CardBasket.ts';
import { CardCatalog } from './components/view/CardCatalog.ts';
import { CardPreview } from './components/view/CardPreview.ts';
import { ContactsForm } from './components/view/ContactsForm.ts';
import { OrderForm } from './components/view/OrderForm.ts';
//импортирование интерфейсов для типизации
import { ICustomer, IOrder, IProduct, TPayment } from './types/index.ts'

//Инициализация брокера событий
const events = new EventEmitter();

//Инициализация моделей данных
const productsModel = new MainCatalog(events);
const cartModel = new ProductsCart(events);
const customerModel = new Customer(events);

//Инициализация API
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

//инициализация контейнеров из шаблонов HTML
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const orderContainer = cloneTemplate<HTMLFormElement>(orderTemplate);
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const contactsContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const headerContainer = ensureElement<HTMLElement>(".header");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const galleryContainer = ensureElement<HTMLElement>(".page__wrapper");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const modalContainer = ensureElement<HTMLElement>(".modal");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const successContainer = cloneTemplate(successTemplate);

//создание экземпляров классов представления
const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(modalContainer, events);
const success = new Success(events, successContainer);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {onClick: () => {
  events.emit('basket:action');
}});
const orderForm = new OrderForm(events, orderContainer, {onSubmit: () => {
  events.emit('order:submit');
}});
const contactsForm = new ContactsForm(contactsContainer, events, {onSubmit: () => {
  events.emit('contacts:submit');
}})

/* Презентер */

//событие: закрытие модалки
events.on('modal:close', () => {
  modal.close();
});

//событие: изменение каталога товаров
events.on('catalog:changed', () => {
  const products = productsModel.getProducts();
  const items = products.map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {onClick: () => {
      events.emit('card:select', {id: item.id});
    }});

    return card.render({
      title: item.title,
      price: item.price,
      image: CDN_URL + item.image,
      category: item.category
    });
  });

  gallery.render({catalog: items});
});

//событие: выбор карточки для просмотра
events.on<{id: string}>('card:select', ({id}) => {
  const product = productsModel.getProductById(id);

  if(product) {
    productsModel.saveSelectedProduct(product);
  }
})

//событие: изменение выбранного для просмотра товара
events.on('preview:changed', () => {
  const product = productsModel.getSelectedProduct();
  
  if(product) {
    const addedToBasket = cartModel.checkProductById(product.id);
    const isAvailable = product.price === null;
    const buttonDisabled = isAvailable;
    const buttonText = isAvailable
      ? 'Недоступно'
      : addedToBasket
        ? 'Удалить из корзины'
        : 'В корзину';

    modal.open();

    modal.render({
      content: cardPreview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: CDN_URL + product.image,
        buttonText,
        buttonDisabled
      })
    })
  } else {
    console.error('Не найден выбранный товар')
    return;
  }
})

//событие: изменение содержимого корзины
events.on('basket:changed', () => {
  const basketProducts = cartModel.getCart();
  
  const basketList = basketProducts.map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {onClick: () => {
      events.emit('basket:item-delete', product);
    }});

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });
  
  const fullPrice = cartModel.getFullPrice();
  const isEmpty = basketProducts.length === 0;
  const isAvailable = !isEmpty && fullPrice > 0;
  const buttonState = !isAvailable;

  const count = cartModel.getProductsQuantity();

  basket.render({
    fullPrice,
    buttonState,
    basketList,
  });

  header.counter = count;

});

//событие: изменение данных покупателя
events.on<{ field?: keyof ICustomer } | Partial<ICustomer>>('customer:changed', (data) => {
  const customerData = customerModel.getData();
  const errors = customerModel.validateData();

  const updatedField = data 
      ? ('field' in data ? data.field : (Object.keys(data)[0] as keyof ICustomer))
      : undefined;

  if (!updatedField || ['payment', 'address'].includes(updatedField)){
    const isOrderValid = !errors.payment && !errors.address;
    const orderErrorMessages = [errors.payment, errors.address]
      .filter(Boolean)
      .join(', ');

    orderForm.render({
      valid: isOrderValid,
      errorText: orderErrorMessages ? `Необходимо указать: ${orderErrorMessages}` : '',
      payment: customerData.payment,
      address: customerData.address,
    });
  };

  if(!updatedField || ['email', 'phone'].includes(updatedField)){
    const isContactsValid = !errors.email && !errors.phone;
    const contactsErrorMessages = [errors.email, errors.phone]
      .filter(Boolean)
      .join(', ');

    contactsForm.render({
      valid: isContactsValid,
      errorText: contactsErrorMessages ? `Необходимо указать: ${contactsErrorMessages}` : '',
      email: customerData.email,
      phone: customerData.phone,
    });
  };
});

//событие: нажатие кнопки покупки товара
events.on('basket:action', () => {
  const selectedProduct = productsModel.getSelectedProduct();
  if (selectedProduct) {
    if (cartModel.checkProductById(selectedProduct.id)) {
      cartModel.deleteProduct(selectedProduct);
      cardPreview.buttonText = 'В корзину';
    } else {
      cartModel.saveProduct(selectedProduct);
      cardPreview.buttonText = 'Удалить из корзины';
    }
  } else {
    console.error('Не найден выбранный товар');
  }
});

//событие: нажатие кнопки удаления товара из корзины
events.on<IProduct>('basket:item-delete', (product) => {
  cartModel.deleteProduct(product);
});

//событие: нажатие кнопки открытия корзины
events.on('basket:open', () => {
  const basketProducts = cartModel.getCart();
  const fullPrice = cartModel.getFullPrice();
  const isEmpty = basketProducts.length === 0;
  const isAvailable = !isEmpty && fullPrice > 0;
  const buttonState = !isAvailable; 
  
  modal.open();
  modal.render({
    content: basket.render({
      buttonState,
      fullPrice
    })
  })
})

//события на изменение данных в формах
events.on<{field: string, value: TPayment}>('order.payment:change', (data) => {
  customerModel.saveData({payment: data.value});
});

events.on<{field: string, value: string}>('order.address:change', (data) => {
  customerModel.saveData({address: data.value});
});

events.on<{field: string, value: string}>('contacts.email:change', (data) => {
  customerModel.saveData({email: data.value});
});

events.on<{field: string, value: string}>('contacts.phone:change', (data) => {
  customerModel.saveData({phone: data.value});
});

//событие: нажатие кнопки оформления заказа
events.on('order:open', () => {
  modal.render({
    content: orderForm.render(),
  })
})

//событие: нажатие кнопки перехода ко второй форме оформления заказа
events.on('order:submit', () => {
  modal.render({
    content: contactsForm.render(),
  });
});

//событие: нажатие кнопки оплаты/завершения оформления заказа
events.on('contacts:submit', () => {
  const cart = cartModel.getCart();
  const data = customerModel.getData();
  const items = cart.map((product) => {
    return product.id;
  })
  const total = cartModel.getFullPrice();

  const newOrder: IOrder = {
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    total,
    items
  }
  
  appApi.createOrder(newOrder).then((data) => {
    console.log('Заказ оформлен. Ответ от сервера: \n', data);
    modal.render({
      content: success.render({
        total: data.total,
      })
    });
    cartModel.clearCart();
    customerModel.clearData();
  })
  .catch((err) => {
    console.log('Ошибка при оформлении заказа: \n', err);
  })
})

//событие: нажатие кнопки закрытия модалки об успешном оформлении заказа
events.on('success-modal:close', () => {
  modal.close();
})

//получение товаров с сервера
appApi.getProducts().then((data) => {
  console.log('Ответ от сервера: \n', data);
  productsModel.saveProducts(data.items);
  console.log('Сохраненный в модели каталог: \n', productsModel.getProducts())
})
.catch((err) => {
  console.log('Ошибка при загрузке каталога с сервера: \n', err);
})
