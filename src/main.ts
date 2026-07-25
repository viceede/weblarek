import './scss/styles.scss';
import {Customer} from "./components/Models/Customer.ts";
import {MainCatalog} from "./components/Models/MainCatalog.ts";
import {ProductsCart} from "./components/Models/ProductsCart.ts";
import { apiProducts } from './utils/data.ts'


//Проверка работы модели данных каталога на главной
const productsModel = new MainCatalog();

productsModel.saveProducts(apiProducts.items);
console.log('Массив товаров из каталога:\n', productsModel.getProducts());
console.log('Товар, полученный по ID из массива товаров:\n', productsModel.getProductById(apiProducts.items[0].id));

const selectedProduct = apiProducts.items[1];
productsModel.saveSelectableProduct(selectedProduct);
console.log('Товар, полученный для подробного отображения:\n', productsModel.getSelectableProduct());

//Проверка работы модели данных корзины с товарами
const cartModel = new ProductsCart();

cartModel.saveProduct(apiProducts.items[0]);
cartModel.saveProduct(apiProducts.items[1]);
console.log('Полученный массив товаров в корзине:\n', cartModel.getCart());

cartModel.deleteProduct(apiProducts.items[1]);
console.log('Массив товаров в корзине после удаления элемента:\n',cartModel.getCart());

cartModel.clearCart();
console.log('Массив товаров в корзине после очистки:\n', cartModel.getCart());

apiProducts.items.forEach((i) => { // для проверки оставшихся методов добавляем все товары в корзину
  cartModel.saveProduct(i)
})
console.log('Получение суммы стоимости всех товаров в корзине:\n', cartModel.getFullPrice());
console.log('Кол-во товаров в корзине:\n', cartModel.productsQuantity());

const verifiableProductId = apiProducts.items[3].id;
console.log('Проверка наличия товара в корзине по ID:\n', cartModel.checkProductById(verifiableProductId));


//Проверка работы модели данных покупателя
const customerModel = new Customer();

customerModel.saveData(
  {
    payment: 'card',
    address: 'г. Санкт-Петербург, Невский пр., д. 25, кв. 12',
    email: 'anna.smirnova@gmail.com',
    phone: '+7 (911) 987-65-43',
  }
);
console.log('Получение всех данных покупателя:\n', customerModel.getData());

customerModel.clearData();
console.log('Данные покупателя после очистки:\n', customerModel.getData());

customerModel.saveData({payment: 'card'});
console.log('Проверка добавления одного значения данных, используя метод saveData():\n', customerModel.getData());

customerModel.clearData(); //очищаем данные для проверки валидации всех полей

console.log(
  'Проверка валидации (отсутствуют все поля):\n',
  customerModel.validateData()
);

customerModel.saveData({payment: 'card'});

console.log(
  'Проверка валидации (заполнен payment):\n',
  customerModel.validateData()
);

customerModel.saveData({address: 'г. Санкт-Петербург, Невский пр., д. 25, кв. 12'});

console.log(
  'Проверка валидации (заполнены payment, address):\n',
  customerModel.validateData()
);

customerModel.saveData({email: 'anna.smirnova@gmail.com'});

console.log(
  'Проверка валидации (заполнены payment, address, email):\n',
  customerModel.validateData()
);

customerModel.saveData({phone: '+7 (911) 987-65-43'});

console.log(
  'Проверка валидации (заполнены все поля):\n',
  customerModel.validateData()
);