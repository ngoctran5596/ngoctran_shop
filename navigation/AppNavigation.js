import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ShopNavigator, AuthNavigator} from './ShopNavigation';
import {useSelector} from 'react-redux';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = props => {
  const isAuth = useSelector (state => !!state.auth.token);
  const didTryAutoLogin = useSelector (state => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
      {/* {isCheck ? <ShopNavigator /> : <AuthNavigator check={isCheck} />} */}
      {/* <AuthNavigator /> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
