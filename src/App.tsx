import React, { useState } from 'react';
import { calculateFinalPrice } from './utils/discountCalculator';
import { CartItem, Category, DiscountCampaigns } from './types/types';
import CardCart from './components/cardCart';
import { CategoryEnum } from './enum/category';
import icon from './assets/home.svg';
import iconshirt from './assets/tshirt.svg';
import iconaccessories from './assets/hat-cowboy.svg';
import iconelectronics from './assets/plug-alt.svg';
const App = () => {
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [couponType, setCouponType] = useState<'None' | 'FixedAmount' | 'Percentage'>('Percentage');
  const [couponValue, setCouponValue] = useState<number>(10);
  const [onTopType, setOnTopType] = useState<'None' | 'PointsDiscount' | 'CategoryPercentage'>('PointsDiscount');
  const [points, setPoints] = useState<number>(68);
  const [category, setCategory] = useState<Category>(CategoryEnum.Clothing);
  const [categoryPercentage, setCategoryPercentage] = useState<number>(15);
  const [seasonalEvery, setSeasonalEvery] = useState<number>(300);
  const [seasonalDiscount, setSeasonalDiscount] = useState<number>(40);

  const initcart: CartItem[] = [
    { name: 'T-Shirt', price: 350, category: CategoryEnum.Clothing },
    { name: 'Hat', price: 250, category: CategoryEnum.Accessories },
    { name: 'Belt', price: 230, category: CategoryEnum.Accessories },
    { name: 'Television', price: 230, category: CategoryEnum.Electronics },
  ];
  const [cart ,setCart] = useState<CartItem[]>(initcart);
  const buildCampaigns = (): DiscountCampaigns => {
    const campaigns: DiscountCampaigns = {};

    if (couponType === 'FixedAmount') {
      campaigns.coupon = { type: 'FixedAmount', amount: couponValue };
    } else if (couponType === 'Percentage') {
      campaigns.coupon = { type: 'Percentage', percentage: couponValue };
    }

    if (onTopType === 'PointsDiscount') {
      campaigns.onTop = { type: 'PointsDiscount', points };
    } else if (onTopType === 'CategoryPercentage') {
      campaigns.onTop = { type: 'CategoryPercentage', category, percentage: categoryPercentage };
    }

    campaigns.seasonal = { type: 'Seasonal', every: seasonalEvery, discount: seasonalDiscount };

    return campaigns;
  };


  const handleExport = () => {
    const data = {
      cart,
      couponType,
      couponValue,
      onTopType,
      points,
      category,
      categoryPercentage,
      seasonalEvery,
      seasonalDiscount,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cart-discount.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.cart) {
          console.log(data.cart);
          setCart(data.cart)
        }
        if (data.couponType) setCouponType(data.couponType);
        if (typeof data.couponValue === 'number') setCouponValue(data.couponValue);
        if (data.onTopType) setOnTopType(data.onTopType);
        if (typeof data.points === 'number') setPoints(data.points);
        if (data.category) setCategory(data.category);
        if (typeof data.categoryPercentage === 'number') setCategoryPercentage(data.categoryPercentage);
        if (typeof data.seasonalEvery === 'number') setSeasonalEvery(data.seasonalEvery);
        if (typeof data.seasonalDiscount === 'number') setSeasonalDiscount(data.seasonalDiscount);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };
   const mappingId =cart.map((item, idx) => ({ ...item, id: idx.toString() }))
  return (
    <div className="app">
      <header className="header">
        <h1>Discount Engine</h1>
      </header>

      <main className="main">
         <section className="panel" style={{paddingRight:'10px'}}>
          <h2>Cart</h2>
            <button onClick={handleExport}>Export JSON</button>
            <input type="file" accept="application/json" onChange={handleImport} />
          <CardCart
            title={'Clothing'}
            price={10}
            subItems={mappingId.filter(item => item.category === CategoryEnum.Clothing)}
            imageUrl={iconshirt}
          ></CardCart>
          <CardCart  title={'Accessories'} price={0} subItems={mappingId.filter(item => item.category === CategoryEnum.Accessories)} imageUrl={iconaccessories} ></CardCart>
          <CardCart  title={'Electronics'} price={0} subItems={mappingId.filter(item => item.category === CategoryEnum.Electronics)} imageUrl={iconelectronics} ></CardCart>
        </section>
        <section className="panel">
          <h2>Coupon</h2>
          <div className="field">
            <select value={couponType} onChange={(e) => setCouponType(e.target.value as any)}>
              <option value="None">None</option>
              <option value="FixedAmount">Fixed Amount</option>
              <option value="Percentage">Percentage</option>
            </select>
            {couponType !== 'None' && (
              <input
              key={couponValue}
              type="number"
              defaultValue={couponValue}
              onBlur={(e) => {
                const value = Number(e.target.value);
                setCouponValue(value);
              }}
              />
            )}
          </div>

          <h2>On Top</h2>
          <div className="field">
            <select value={onTopType} onChange={(e) => setOnTopType(e.target.value as any)}>
              <option value="None">None</option>
              <option value="PointsDiscount">Points Discount</option>
              <option value="CategoryPercentage">Category % Discount</option>
            </select>
            {onTopType === 'PointsDiscount' && (
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            )}
            {onTopType === 'CategoryPercentage' && (
              <>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                </select>
                <input
                  type="number"
                  value={categoryPercentage}
                  onChange={(e) => setCategoryPercentage(Number(e.target.value))}
                />
              </>
            )}
          </div>

          <h2>Seasonal</h2>
          <div className="field">
            <input
              type="number"
              value={seasonalEvery}
              onChange={(e) => setSeasonalEvery(Number(e.target.value))}
                   step={100}
            />
            <input
              type="number"
              value={seasonalDiscount}
              onChange={(e) => setSeasonalDiscount(Number(e.target.value))}
              step={10}
            />
          </div>

          <button onClick={() => setFinalPrice(calculateFinalPrice(cart, buildCampaigns()))}>
            Calculate Final Price
          </button>

          {finalPrice !== null && (
            <p className="result">Final Price: {finalPrice} THB</p>
          )}
        </section>
      </main>
      
    </div>
  );
};
export default App;