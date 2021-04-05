import React, {useEffect, useCallback, useReducer, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updateValue = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updateFormIsValid = true;
    for (const key in updateValidities) {
      updateFormIsValid = updateFormIsValid && updateValidities[key];
    }
    return {
      formIsValid: updateFormIsValid,
      inputValues: updateValue,
      inputValidities: updateValidities,
    };
  }
  return state;
};

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState (false);
  const [error, setError] = useState ();
  const prodId = props.route.params ? props.route.params.productId : null;
  const editedProduct = useSelector (state =>
    state.products.userProducts.find (prod => prod.id === prodId)
  );
  const dispatch = useDispatch ();

  const [formState, distpatchFormState] = useReducer (formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const submitHandler = useCallback (
    async () => {
      if (!formState.formIsValid) {
        Alert.alert ('Wrong input...', 'Please checked form', [{text: 'Ok'}]);
        return;
      }
      setError (null);
      setIsLoading (true);
      try {
        if (editedProduct) {
          await dispatch (
            productsActions.updateProduct (
              prodId,
              formState.inputValues.title,
              formState.inputValues.description,
              formState.inputValues.imageUrl
            )
          );
        } else {
          await dispatch (
            productsActions.createProduct (
              formState.inputValues.title,
              formState.inputValues.description,
              formState.inputValues.imageUrl,
              +formState.inputValues.price
            )
          );
        }
        props.navigation.goBack ();
      } catch (error) {
        setError (error.message);
      }
      setIsLoading (false);
    },
    [dispatch, prodId, formState]
  );

  useEffect (
    () => {
      if (error) {
        Alert.alert ('LỖI', error, [{text: 'OK'}]);
      }
    },
    [error]
  );

  useEffect (
    () => {
      props.navigation.setOptions ({
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Save"
              iconName={
                Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
              }
              onPress={submitHandler}
            />
          </HeaderButtons>
        ),
      });
    },
    [submitHandler]
  );
  const inputChangeHandler = useCallback (
    (inputIndentifier, inputValue, inputIsValid) => {
      distpatchFormState ({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputIsValid,
        input: inputIndentifier,
      });
    },
    [distpatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="title"
          label="Title"
          errorText="Please enter valid Title"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ''}
          initiallyValid={!!editedProduct}
        />
        <Input
          id="imageUrl"
          label="Image Url"
          errorText="Please enter valid ImageUrl"
          keyboardType="default"
          onInputChange={inputChangeHandler}
          returnKeyType="next"
          initialValue={editedProduct ? editedProduct.imageUrl : ''}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct
          ? null
          : <Input
              id="price"
              label="Price"
              errorText="Please enter valid Price"
              keyboardType="decimal-pad"
              autoCapitalize="sentences"
              onInputChange={inputChangeHandler}
              autoCorrect={false}
              required
              min={0.1}
            />}
        <Input
          id="description"
          label="Description"
          errorText="Please enter valid Description"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          multiline
          numberOfline={3}
          initialValue={editedProduct ? editedProduct.description : ''}
          initiallyValid={!!editedProduct}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product',
  };
};

const styles = StyleSheet.create ({
  form: {
    margin: 20,
  },
  formControl: {
    width: '100%',
  },
  label: {
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProductScreen;
