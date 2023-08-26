import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '../constants/colors';

const Loading: React.FC<ILoading> = ({color = colors.white}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={color}
        style={styles.loaderStyle}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black1,
  },
  loaderStyle: {
    height: 60,
  },
});
