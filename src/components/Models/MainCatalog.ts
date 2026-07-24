
import { IProduct } from '../../types/index.ts';

export class MainCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | undefined;

  constructor() {
    this.products = [];
    this.selectedProduct = undefined;
  }

  saveProducts(products: IProduct[]): void{
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const product = this.products.find((product: IProduct) : boolean => {
      return product.id === id;
    })

    return product;
  }

  saveSelectableProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
  }

  getSelectableProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
