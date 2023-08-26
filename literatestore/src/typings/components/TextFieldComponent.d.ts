import {TextInputProps} from 'react-native';

interface ITextFieldComponent extends TextInputProps {
  control?: Control<FieldValues, any>;
  name: string;
  startIcon?: any;
  errorText?: string
}
