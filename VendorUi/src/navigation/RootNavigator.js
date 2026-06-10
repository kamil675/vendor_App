import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainTabs from './MainTabs';
import AuthStack from './AuthStack';

import { getToken } from '../utils/storage';

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await getToken();

      if (token) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  global.setLoggedIn = setLoggedIn;

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {loggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
