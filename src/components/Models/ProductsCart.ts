import { IProduct } from '../../types/index.ts'

export class ProductsCart {
	private cart: IProduct[]

	constructor() {
		this.cart = []
	}

	getCart(): IProduct[] {
		return [...this.cart]
	}

	saveProduct(product: IProduct): void {
		this.cart.push(product)
	}

	deleteProduct(product: IProduct): void {
		this.cart = this.cart.filter((cartProduct) => cartProduct.id !== product.id);
	}

	clearCart(): void {
		this.cart.length = 0
	}

	getFullPrice(): number {
		let fullPrice = 0
		this.cart.forEach((product: IProduct): void => {
			if (product.price !== null) {
				fullPrice += product.price
			}
		})

		return fullPrice
	}

	getProductsQuantity(): number {
		return this.cart.length
	}

	checkProductById(id: string): boolean {
		return this.cart.some(product => product.id === id)
	}
}
