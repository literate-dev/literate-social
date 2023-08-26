/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/Loading';
import auth from '@react-native-firebase/auth';

const Protected: React.FC<{children: JSX.Element}> = ({children}) => {
  const navigation: ScreenNavigationProp = useNavigation();
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    setLoading(true);
    const currentUser = auth().currentUser;
    setLoading(false);
    if (!currentUser) {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkUser();
    return () => {
      setLoading(false);
    };
  }, [navigation]);

  return loading ? <Loading /> : children;
};

export default Protected;
