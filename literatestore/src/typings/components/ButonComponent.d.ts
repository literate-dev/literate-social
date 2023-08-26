import {TouchableOpacityProps} from 'react-native';

interface IButtonComponent extends TouchableOpacityProps {
  text: string;
  loading?: boolean;
  containerStyles?: any
}
