import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Button,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';

// import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import * as cartAction from '../../store/actions/cart';
import * as productsAction from '../../store/actions/products';

const ProductsScreen = props => {
  const products = useSelector (state => state.products.availableProducts);
  const dispatch = useDispatch ();

  const [isLoading, setIsLoading] = useState (false);
  const [isRefreshing, setIsRefreshing] = useState (false);
  const [err, setErr] = useState ();

  const loadProducts = useCallback (
    async () => {
      setErr (null);
      setIsRefreshing (true);
      try {
        dispatch (productsAction.fecthProducts ());
      } catch (error) {
        setErr (error.message);
      }
      setIsRefreshing (false);
    },
    [dispatch, setIsLoading, setErr]
  );

  useEffect (
    () => {
      const unsubscribe = props.navigation.addListener ('focus', loadProducts);

      return () => {
        unsubscribe ();
      };
    },
    [loadProducts]
  );

  useEffect (
    () => {
      setIsLoading (true);
      loadProducts ().then (() => {
        setIsLoading (false);
      });
    },
    [dispatch, loadProducts]
  );

  const selectItemHandler = (id, title) => {
    props.navigation.navigate ('ProductDetail', {
      productId: id,
      productTitle: title,
    });
  };
  if (isLoading) {
    return (
      <View style={styles.activityCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (err) {
    return (
      <View style={styles.activityCenter}>
        <Text>Lỗi rồi !</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.activityCenter}>
        <Text>Chưa có sản phẩm! thêm ngay nào</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <View>
          <Text style={styles.title}>MỚi Thêm Gần Đây</Text>
          <SafeAreaView style={{flex: 1}}>
            <FlatList
              horizontal={true}
              onRefresh={loadProducts}
              refreshing={isRefreshing}
              data={products}
              keyExtractor={item => item.id}
              renderItem={itemData => (
                <ProductItem
                  style={styles.widthFlatlist1}
                  image={itemData.item.imageUrl}
                  title={itemData.item.title}
                  price={itemData.item.price}
                  onSelect={() => {
                    selectItemHandler (itemData.item.id, itemData.item.title);
                  }}
                >
                  <Button
                    color={Colors.primary}
                    title="View"
                    onPress={() => {
                      selectItemHandler (itemData.item.id, itemData.item.title);
                    }}
                  />
                  <Button
                    color={Colors.primary}
                    title="To Cart"
                    onPress={() => {
                      Alert.alert (
                        'CART',
                        'By Product',
                        [
                          {
                            text: 'NO',
                            onPress: () => {},
                          },
                          {
                            text: 'OK',
                            onPress: () =>
                              dispatch (cartAction.addToCart (itemData.item)),
                          },
                        ],
                        {cancelable: false}
                      );
                    }}
                  />
                </ProductItem>
              )}
            />
          </SafeAreaView>
        </View>

        <View>
          <Text style={styles.title}>Sản phẩm tốt</Text>

          <FlatList
            data={products}
            horizontal={true}
            keyExtractor={item => item.id}
            renderItem={itemData => (
              <ProductItem
                style={styles.productCustum}
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                  selectItemHandler (itemData.item.id, itemData.item.title);
                }}
              >
                <Button
                  color={Colors.primary}
                  title="View"
                  onPress={() => {
                    selectItemHandler (itemData.item.id, itemData.item.title);
                  }}
                />
                <Button
                  color={Colors.primary}
                  title="To Cart"
                  onPress={() => {
                    Alert.alert (
                      'CART',
                      'By Product',
                      [
                        {
                          text: 'NO',
                          onPress: () => {},
                        },
                        {
                          text: 'OK',
                          onPress: () =>
                            dispatch (cartAction.addToCart (itemData.item)),
                        },
                      ],
                      {cancelable: false}
                    );
                  }}
                />
              </ProductItem>
            )}
          />

        </View>
      </View>
    </ScrollView>
  );
};

export default ProductsScreen;
export const screenOptions = navData => {
  return {
    headerTitle: 'All Products',

    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate ('CartProduct');
          }}
        />
      </HeaderButtons>
    ),
  };
};
const styles = new StyleSheet.create ({
  activityCenter: {
    flex: 1,
    color: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widthFlatlist1: {
    width: 200,
  },
  widthFlatlist2: {
    width: '100%',
  },
  title: {
    padding: 10,
    textAlign: 'center',
  },
  productCustum: {
    width: '95%',
    flexDirection: 'row',
  },
});
