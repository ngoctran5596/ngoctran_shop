import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import OrderItem from '../../components/shop/OderItem';
import Colors from '../../constants/Colors';
import * as ordersActions from '../../store/actions/orders';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState (false);

  const orders = useSelector (state => state.orders.orders);
  const dispatch = useDispatch ();

  useEffect (
    () => {
      setIsLoading (true);
      dispatch (ordersActions.fetchOrder ()).then (() => {
        setIsLoading (false);
      });
    },
    [dispatch]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (orders.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Bạn chưa mua sản phẩm nào!!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        (console.log (itemData), (
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
          />
        ))}
    />
  );
};

export default OrdersScreen;

const styles = StyleSheet.create ({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
