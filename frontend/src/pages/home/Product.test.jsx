import {it,expect,describe,vi, beforeEach} from 'vitest';
import {render,screen} from '@testing-library/react'
import axios, { Axios } from 'axios';
import userEvent from '@testing-library/user-event'
import { Product } from './Product.jsx';
vi.mock('axios');
describe('product testing on product page ',()=>{
    let product;
    let user;
 let loadcart;
   
    beforeEach(()=>{
        product =  {
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
              stars: 4.5,
              count: 87
            },
            priceCents: 1090,
            keywords: ["socks", "sports", "apparel"]
        };
        loadcart=vi.fn( )
         user=userEvent.setup();
      
    })
    it('checking the product details',()=>{
       
     render(<Product product={product} loadcart={loadcart}/>)
     expect(screen.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();
     expect(screen.getByText('$10.90')).toBeInTheDocument();
     expect(screen.getByTestId('product-image')).toHaveAttribute('src','images/products/athletic-cotton-socks-6-pairs.jpg');
     expect(screen.getByTestId('product-ratings')).toHaveAttribute('src',`images/ratings/rating-45.png`);
     expect(screen.getByText('87')).toBeInTheDocument();

    });


    it('to check the add to cart button',async()=>{
      
     render(<Product product={product} loadcart={loadcart}/>)
     
    const addtocartbutton= screen.getByTestId('add-to-cart-button')
   await user.click(addtocartbutton)
   expect(axios.post).toHaveBeenCalledWith(
    '/api/cart-items',{
        productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity:1
    });
  
    expect(loadcart).toHaveBeenCalled();


    });
  

    it('to check the quantity',async()=>{
      
     render(<Product product={product} loadcart={loadcart}/>)
     const quantitySelector =screen.getByTestId('quantity-container');
  
     expect(quantitySelector).toHaveValue('1');
      
    
    await user.click(quantitySelector)
     await user.selectOptions(quantitySelector,'3')

     expect(quantitySelector).toHaveValue('3');


     const addtocartbutton= screen.getByTestId('add-to-cart-button')
     await user.click(addtocartbutton)
     expect(axios.post).toHaveBeenCalledWith(
      '/api/cart-items',{
          productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity:3
      });
    
      expect(loadcart).toHaveBeenCalled();
  

    });
  
});
