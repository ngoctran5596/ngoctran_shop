import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createMaterialBottomTabNavigator,
} from '@react-navigation/material-bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import ProductsScreen, {
  screenOptions as CartProductOption,
} from '../screens/shop/ProductsScreen';
import EditProductScreen, {
  screenOptions as editProductOption,
} from '../screens/user/EditProductScreen';
import UserProductScreen, {
  screenOptions as productsOverviewScreenOptions,
} from '../screens/user/UserProduct';
import OrderScreen from '../screens/shop/OrderScreen';
import CartScreen from '../screens/shop/CartScreen';
import DetailProduct, {
  screenOptions as detailProducts,
} from '../screens/shop/DetailProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import Colors from '../constants/Colors';
const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  // headerTitleStyle: {
  //   fontFamily: 'open-sans-bold',
  // },
  // headerBackTitleStyle: {
  //   fontFamily: 'open-sans',
  // },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};
const ProductsStackNavigator = createStackNavigator ();
export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name="ProductsOverviewScreen"
        component={ProductsScreen}
        options={CartProductOption}
      />
      <ProductsStackNavigator.Screen
        name="ProductDetail"
        component={DetailProduct}
        options={detailProducts}
      />
      <ProductsStackNavigator.Screen
        name="CartProduct"
        component={CartScreen}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const OrdersStackNavigator = createStackNavigator ();

export const OrdersNavigator = () => {
  return (
    <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <OrdersStackNavigator.Screen
        name="OrdersScreen"
        component={OrderScreen}
      />
    </OrdersStackNavigator.Navigator>
  );
};
const AdminNavigator = createStackNavigator ();

export const AdminNavigation = () => {
  return (
    <AdminNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminNavigator.Screen
        name="UserProducts"
        component={UserProductScreen}
        options={productsOverviewScreenOptions}
      />
      <AdminNavigator.Screen
        name="EditProducts"
        component={EditProductScreen}
        options={editProductOption}
      />
    </AdminNavigator.Navigator>
  );
};
const BottomTabNavigator = createMaterialBottomTabNavigator ();

export const ShopNavigator = () => {
  const [colorBg, setColorBg] = React.useState ('#0099CC');
  return (
    <BottomTabNavigator.Navigator barStyle={{backgroundColor: '#F0274F'}}>
      <BottomTabNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          tabBarIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color="#ffff"
            />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          tabBarIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color="#ffffff"
            />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name="Admin"
        component={AdminNavigation}
        options={{
          tabBarIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color="#ffffff"
            />
          ),
        }}
      />
      {/* // component={AdminNavigator}
      // options={{
      //   tabBarIcon: props => (
      //     <Ionicons
      //       name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
      //       size={23}
      //       color="#ffffff"
      //     />
      //   ),
      // }} */}
    </BottomTabNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator ();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      headerMode="none"
      screenOptions={defaultNavOptions}
    >
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        // options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
