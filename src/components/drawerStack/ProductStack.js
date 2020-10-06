import React from 'react';
import SingleStack from './SingleStack';
import ProductFragment from '../../fragments/ProductFragment';
const ProductStack = () => {

    return <SingleStack name='Product' component={ProductFragment} />
}
export default ProductStack;