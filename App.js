import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import AppNavigator from './navigation/AppNavigation';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import authReducer from './store/reducers/auth';
import CartReduce from './store/reducers/cart';
import ordersReducer from './store/reducers/order';

const rootReducer = combineReducers ({
  products: productsReducer,
  cart: CartReduce,
  orders: ordersReducer,
  auth: authReducer,
});
const store = createStore (rootReducer, applyMiddleware (ReduxThunk));

export default function App () {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
