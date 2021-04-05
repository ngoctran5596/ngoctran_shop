import React from 'react';
import {FlatList, Button, Platform, Alert, View, Text} from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import {useSelector, useDispatch} from 'react-redux';
// import Colors from '../../contanst/Colors';
import * as productsActions from '../../store/actions/products';
import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/Colors';

const UserProduct = props => {
  const userProducts = useSelector (state => state.products.userProducts);
  const dispatch = useDispatch ();

  const editProductHandler = id => {
    props.navigation.navigate ('EditProducts', {productId: id});
  };

  const deleteHandler = id => {
    Alert.alert (
      'DELETE',
      'Xóa sản phẩm?',
      [
        {
          text: 'NO',
          style: 'default',
        },
        {
          text: 'YES',
          style: 'destructive',
          onPress: () => dispatch (productsActions.deleteProduct (id)),
        },
      ],
      {cancelable: false}
    );
  };
  if (userProducts.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Bạn chưa thêm một Sản phẩm nào cả!!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {}}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler (itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => deleteHandler (itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};
export const screenOptions = navData => {
  const dispatch = useDispatch ();
  return {
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-restaurant" size={23} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primaryColor,
    },
    headerTitle: 'Your Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={
            Platform.OS === 'android'
              ? 'md-log-out-outline'
              : 'ios-log-out-outline'
          }
          onPress={() => {
            dispatch (authActions.logout ());
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate ('EditProducts');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProduct;
