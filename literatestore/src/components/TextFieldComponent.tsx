import { TextInput, StyleSheet, View, Image, Text } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { useController } from 'react-hook-form'
import { ITextFieldComponent } from '../typings/components/TextFieldComponent'

const TextFieldComponent: React.FC<ITextFieldComponent> = ({
  control,
  name,
  startIcon,
  errorText,
  ...rest
}) => {
  const { field } = useController({ control: control, name: name })
  if (startIcon) {
    return (
      <View>
        <View style={styles.searchSection}>
          <Image style={styles.searchIcon} source={startIcon} />
          <TextInput
            {...rest}
            placeholderTextColor={colors.white1}
            onChangeText={field.onChange}
            value={field.value}
          />
        </View>
          {
           errorText ? <Text style={styles.errorText}>{errorText}</Text> : null
          }
      </View>
    )
  }
  return (
    <TextInput
      {...rest}
      placeholderTextColor={colors.white1}
      onChangeText={field.onChange}
      value={field.value}
    />
  )
}

export default TextFieldComponent

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    padding: 10,
    height: 25,
    width: 25,
    position: 'absolute',
    left: 5,
    top: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12
  }
})
