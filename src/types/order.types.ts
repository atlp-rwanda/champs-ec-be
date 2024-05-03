import { Optional } from "sequelize";

export type INTUSERPRODUCT = {
  name: string;
  unit_amount: number;
  image: string;
  quantity: number;
};
export type IPRODUCTINCART = {
  product: string;
  quantity: number;
  totalPrice: number;
};
export type ILINESITEM = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
};

export type IORDER = {
  buyerId: string;
  productId: string;
  totalAmount: number;
  deliveryDate: Date;
  quantity: number;
  isPaid: boolean;
  paymentDate: Date;
};

export interface OrdersAttributes {
  id?: string;
  buyerId?: string;
  productId?: string;
  totalAmount?: number;
  quantity?: number;
  paymentDate?: Date;
  isPaid?: boolean;
  deliveryDate?: Date;
  deliveryStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OrdersCreationAttributes
  extends Optional<OrdersAttributes, "id"> {}
