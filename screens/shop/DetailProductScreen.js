import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import * as CartAction from '../../store/actions/cart';

const DetailProductScreen = props => {
  const dispatch = useDispatch ();
  const productId = props.route.params.productId;
  const productDetail = useSelector (state => {
    return state.products.availableProducts.find (
      prod => prod.id === productId
    );
  });
  return (
    <ScrollView style={{padding: 10}}>
      <Image style={styles.image} source={{uri: productDetail.imageUrl}} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add to cart"
          onPress={() => {
            dispatch (CartAction.addToCart (productDetail));
          }}
        />
      </View>
      <Text style={styles.price}>${productDetail.price.toFixed (2)}</Text>
      <Text style={styles.description}>{productDetail.description}</Text>
    </ScrollView>
  );
};

export default DetailProductScreen;

export const screenOptions = navData => {
  return {headerTitle: navData.route.params.productTitle};
};

const styles = StyleSheet.create ({
  image: {
    width: '100%',
    height: 300,
    borderRadius: 9,
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
});
