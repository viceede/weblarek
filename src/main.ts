//TODO: Дописать презентер

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
import { Card } from './components/view/Card.ts';
import { CardBasket } from './components/view/CardBasket.ts';
import { CardCatalog } from './components/view/CardCatalog.ts';
import { CardPreview } from './components/view/CardPreview.ts';
import { Form } from './components/view/Form.ts';
import { ContactsForm } from './components/view/ContactsForm.ts';
import { OrderForm } from './components/view/OrderForm.ts';
import { ICustomer } from './types/index.ts'

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
  events.emit('basket:changed');
}})

/* Презентер */

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

//событие: изменение выбранного для просмотра товаров
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

//событие: закрытие модалки
events.on('modal:close', () => {
  modal.close();
});

//событие: нажатие кнопки открытия корзины
events.on('basket:open', () => {
  modal.open();
  modal.render({
    content: basket.render()
  })
}) 

//событие: изменение содержимого корзины
events.on('basket:changed', () => {
  const products = cartModel.getCart();
  const total = cartModel.getFullPrice();
  const quantity = cartModel.getProductsQuantity();
  const isEmpty = quantity === 0;
  const availableToOrder = !isEmpty && total > 0;

  const basketList = products.map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {onClick: () => {
      events.emit('basket:delete', {id: product.id});
    }});

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1
    });
  });

  basket.render({
    basketList: basketList,
    fullPrice: total,
    buttonState: !availableToOrder
  });

  header.counter = quantity;
})

//событие: изменение данных покупателя
events.on<Partial<ICustomer>>("customer:changed", (data) => {
  customerModel.saveData(data);
});


//получение товаров с сервера
appApi.getProducts().then((data) => {
  console.log('Ответ от сервера: ', data);
  productsModel.saveProducts(data.items);
  console.log('Сохраненный в модели каталог: ', productsModel.getProducts())
})
.catch((err) => {
  console.log('Ошибка при загрузке каталога с сервера: ', err);
})
