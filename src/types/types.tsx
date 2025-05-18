import { CategoryEnum } from "../enum/category";

export type Category = CategoryEnum

export interface CartItem {
  name: string;
  price: number;
  category: Category;
}

export type CouponCampaign =
  | { type: 'FixedAmount'; amount: number }
  | { type: 'Percentage'; percentage: number };

export type OnTopCampaign =
  | { type: 'CategoryPercentage'; category: Category; percentage: number }
  | { type: 'PointsDiscount'; points: number };

export type SeasonalCampaign = {
  type: 'Seasonal';
  every: number;
  discount: number;
};

export interface DiscountCampaigns {
  coupon?: CouponCampaign;
  onTop?: OnTopCampaign;
  seasonal?: SeasonalCampaign;
}
