import { Product } from 'src/app/_models/product';
export interface Cart{
  cartid :string;
  products: Product[];
}
