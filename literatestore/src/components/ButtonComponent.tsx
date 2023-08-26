import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { IButtonComponent } from '../typings/components/ButonComponent'

const { width, height } = Dimensions.get('window')

const ButtonComponent: React.FC<IButtonComponent> = ({
  text,
  loading = false,
  containerStyles,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.loginButton, ...containerStyles }}
      disabled={loading}
      {...rest}
    >
      <Text style={styles.loginButtonText}>{text}</Text>
      {loading ? <ActivityIndicator color={colors.white} /> : null}
    </TouchableOpacity>
  )
}

export default ButtonComponent

const styles = StyleSheet.create({
  loginButton: {
    width: width * 0.8,
    alignSelf: 'center',
    backgroundColor: colors.pink,
    marginTop: height * 0.05,
    height: height * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
  },
})
