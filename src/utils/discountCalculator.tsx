import { CartItem, DiscountCampaigns } from "../types/types";

export function calculateFinalPrice(
  cartItems: CartItem[],
  campaigns: DiscountCampaigns
): number {
  let total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Coupon discounts
  if (campaigns.coupon) {
    if (campaigns.coupon.type === 'FixedAmount') {
      total -= campaigns.coupon.amount;
    } else if (campaigns.coupon.type === 'Percentage') {
      total *= 1 - campaigns.coupon.percentage / 100;
    }
  }

  // On Top discounts
  if (campaigns.onTop) {
    if (campaigns.onTop.type === 'CategoryPercentage') {
      const { category, percentage } = campaigns.onTop;
      const discount = cartItems
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.price, 0) * (percentage / 100);
      total -= discount;
    } else if (campaigns.onTop.type === 'PointsDiscount') {
      const maxDiscount = total * 0.2;
      const discount = Math.min(campaigns.onTop.points, maxDiscount);
      total -= discount;
    }
  }

  // Seasonal discounts
  if (campaigns.seasonal) {
    const { every, discount } = campaigns.seasonal;
    const seasonalDiscount = Math.floor(total / every) * discount;
    total -= seasonalDiscount;
  }

  return Math.max(0, Math.round(total * 100) / 100);
}
