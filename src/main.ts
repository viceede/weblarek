//импортирование стилей
import './scss/styles.scss';
//импортирование моделей данных
import {Customer} from "./components/Models/Customer.ts";
import {MainCatalog} from "./components/Models/MainCatalog.ts";
import {ProductsCart} from "./components/Models/ProductsCart.ts";
//импортирование компонентов API
import { Api } from './components/base/Api.ts';
import { AppApi } from "./components/communication/AppApi.ts";
import { API_URL } from './utils/constants.ts';

//Инициализация моделей данных
const productsModel = new MainCatalog();
const cartModel = new ProductsCart();
const customerModel = new Customer();

//Инициализация API
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

//получение товаров с сервера
appApi.getProducts().then((data) => {
  console.log('Ответ от сервера: ', data);
  productsModel.saveProducts(data.items);
})
.catch((err) => {
  console.log('Ошибка при загрузке каталога с сервера: ', err);
})
