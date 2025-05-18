import React from 'react';
import './cardCart.css';
import { CartItem } from '../types/types';



type ToCartItem = CartItem & { id: string };
type CardCartProps = {
    title: string;
    subItems: ToCartItem[];
    description?: string;
    price: number;
    imageUrl?: string;
    onAddToCart?: () => void;
};

const CardCart: React.FC<CardCartProps> = ({
    title,
    subItems,
    description,
    price,
    imageUrl,
    onAddToCart,
}) => {
    return (
        <div className="card-cart" style={{ background: "#A0C878", borderRadius: '10px', boxShadow: '0 2px 8px #eee', height: '150px', marginTop: '10px' }}>
            <div className='card-cart__bg-icon'>
                {imageUrl && <img src={imageUrl} alt={title} style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain', fill: "red" }} />}
            </div>
            <div style={{ padding: '10px' ,display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%' }}>
                <div>
                    <h3 style={{ margin: '8px 0 4px 0' }}>{title}</h3>
                    <ul
                        style={{
                            padding: 0,
                            margin: '4px 0',
                            listStyle: 'none',
                            height: '70px',
                            overflow: 'auto',
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none', 
                        }}
                    >
                        {subItems.map(item => (
                            <li key={item.id} style={{ fontSize: '1em', color: '#444', marginBottom: '2px' }}>
                                <span style={{ marginLeft: 8, color: '#FFFDF6' }}>{item.name}</span>
                                {item.price !== undefined && (
                                    <span style={{ marginLeft: 8, color: '#FFFDF6' }}>{item.price}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {description && <p style={{ color: '#666', marginBottom: '8px' }}>{description}</p>}
                    <div style={{ padding:"10px",display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1em' ,color:"#FAF6E9"}}>${subItems.reduce((prev, curr) => prev + curr.price, 0).toFixed(2)}</span>
                        {onAddToCart && (
                            <button onClick={onAddToCart} style={{ padding: '6px 14px', borderRadius: '5px', background: '#1976d2', color: '#fff', border: 'none' }}>
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default CardCart;