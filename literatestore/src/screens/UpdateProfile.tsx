import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ImageBackground,
  useColorScheme,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ButtonComponent from '../components/ButtonComponent'
import TextFieldComponent from '../components/TextFieldComponent'
import { colors } from '../constants/colors'
import _ from 'lodash'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import fireStore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import { launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import { Platform } from 'react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { ActivityIndicator } from 'react-native'
import fbIcon from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import instagram from '../assets/instagram.png'
import website from '../assets/website.png'
import coverImage from '../assets/sampleBackgroundImage.jpg'

const { height, width } = Dimensions.get('window')

const schema = yup.object({
  name: yup.string(),
  photo: yup.string(),
  coverPhoto: yup.string(),
  facebook: yup.string().url("Facebook url not valid"),
  instagram: yup.string().url("Instagram url not valid"),
  twitter: yup.string().url("Twitter url not valid"),
  website: yup.string().url("Website url not valid"),
})

const UpdateProfile = () => {
  const isFocused = useIsFocused()
  const theme = useColorScheme()
  const navigation = useNavigation()
  const currentUserUid = auth().currentUser?.uid
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      photo: '',
      coverPhoto: '',
      facebook: '',
      instagram: '',
      twitter: '',
      website: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverPhotoLoading, setCoverPhotoLoading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const uploadImage = async (uri: any, type: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const currentUser = auth().currentUser?.uid
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    if (type === 'profile') {
      setUploading(true)
      setTransferred(0)
    } else if(type === "cover") {
      setCoverPhotoLoading(true)
      setTransferred(0)
    }
    const task = storage()
      .ref(`${currentUser}/${type}/${filename}`)
      .putFile(uploadUri)
    task.on('state_changed', (snapshot) => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      )
    })
    try {
      const response = await task
      const fileRef = storage().ref(response.metadata.fullPath)
      fileRef
        .getDownloadURL()
        .then(async (url) => {
          const document = fireStore().collection('Users').doc(currentUserUid)
          const docData = await document.get()
          const data = docData.data()
          if (type === 'profile') {
            setValue('photo', url)
          } else if(type === "cover") {
            setValue('coverPhoto', url)
          }
        })
        .catch((error) => {
          console.log('Error getting file URL:', error)
        })
    } catch (e) {
      console.error(e)
    } finally {
      if (type === 'profile') {
        setUploading(false)
      } else if(type === "cover") {
        setCoverPhotoLoading(false)
      }
    }
  }

  const selectImage = (type: string) => {
    launchImageLibrary({ mediaType: 'photo' }, (response: any) => {
      try {
        const data: any = response.assets[0].uri
        if (type === 'profile') {
          setValue('photo', data)
        } else {
          setValue('coverPhoto', data)
        }
        // uploadImage(data, type)
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to upload' })
      }
    })
  }

  const onSubmit = async (data: any) => {
    // Handle form submission here
    setLoading(true)
    const document = await fireStore()
      .collection('Users')
      .doc(currentUserUid)
      .get()

    const details = document.data()

    const photo = _.get(details, 'photo', '')
    const coverPhoto = _.get(details, 'coverPhoto')

    try {
      const document = fireStore().collection('Users').doc(currentUserUid)
      if (photo !== watch('photo')) {
      }
      if (coverPhoto !== watch('coverPhoto')) {
        await uploadImage(watch('coverPhoto'), 'cover')
      }

      if (photo !== watch('photo')) {
        await uploadImage(watch('photo'), 'profile')
      }
      await document.set({
        ...details,
        ...data,
      })
      Toast.show({ type: 'success', text1: 'Successfully updated the profile' })
      setLoading(false)
      navigation.goBack()
    } catch (err) {
      console.log(err, 'ERR....')
    } finally {
      setLoading(false)
    }
  }

  const getUser = async () => {
    try {
      const document = await fireStore()
        .collection('Users')
        .doc(currentUserUid)
        .get()

      const details = document.data()

      setValue('name', _.get(details, 'name', ''))
      setValue('photo', _.get(details, 'photo', ''))
      setValue("coverPhoto", _.get(details, 'coverPhoto', '') )
      setValue("facebook", _.get(details, 'facebook', '') )
      setValue("instagram", _.get(details, 'instagram', '') )
      setValue("twitter", _.get(details, 'twitter', '') )
      setValue("website", _.get(details, 'website', '') )
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [isFocused])

  const handleEdit = (type: string) => {
    selectImage(type)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.coverImageContainer}>
          <ImageBackground
            source={watch("coverPhoto") ? { uri: watch('coverPhoto')  } : coverImage}
            style={[
              { ...styles.coverImage, opacity: coverPhotoLoading ? 0.5 : 1 },
            ]}
          />
          {coverPhotoLoading ? (
            <ActivityIndicator
              style={[{ ...styles.loading, left: '45%' }]}
              color={colors.white}
              size={27}
            />
          ) : null}
          <TouchableOpacity
            style={[{ ...styles.editIconContainer, right: 10, bottom: 10 }]}
            activeOpacity={0.6}
            onPress={() => handleEdit('cover')}
          >
            <Feather name="edit" color={colors.white} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            {watch('photo') ? (
              <Image
                style={[
                  {
                    ...styles.profileImageData,
                    opacity: uploading ? 0.5 : 1,
                  },
                ]}
                source={{ uri: watch('photo') }}
              />
            ) : null}
            {uploading ? (
              <ActivityIndicator
                style={styles.loading}
                color={colors.white}
                size={27}
              />
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.editIconContainer}
            activeOpacity={0.6}
            onPress={() => handleEdit('profile')}
          >
            <Feather name="edit" color={colors.white} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
        <TextFieldComponent
          name="name"
          control={control}
          style={styles.textField}
          placeholder="Enter Name"
        />
        <TextFieldComponent
          name="facebook"
          startIcon={fbIcon}
          control={control}
          style={[{ ...styles.textField, paddingLeft: 35 }]}
          placeholder="Facebook Url"
          errorText={errors['facebook']?.message}
        />
        <TextFieldComponent
          name="twitter"
          control={control}
          startIcon={twitter}
          style={[{ ...styles.textField, paddingLeft: 35 }]}
          placeholder="Twitter Url"
          errorText={errors['twitter']?.message}
        />
        <TextFieldComponent
          name="instagram"
          control={control}
          startIcon={instagram}
          style={[{ ...styles.textField, paddingLeft: 35 }]}
          placeholder="Instagram Url"
          errorText={errors['instagram']?.message}
        />
        <TextFieldComponent
          name="website"
          control={control}
          startIcon={website}
          style={[{ ...styles.textField, paddingLeft: 35 }]}
          placeholder="Website Url"
          errorText={errors['website']?.message}
        />
        <View style={styles.buttonContainer}>
          <ButtonComponent
            text="Cancel"
            onPress={() => navigation.goBack()}
            containerStyles={styles.button}
          />
          <ButtonComponent
            text="Submit"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            containerStyles={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flex: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: height * 0.1,
    color: colors.white,
  },
  textField: {
    borderWidth: 1,
    borderColor: colors.white,
    width: width * 0.7,
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 5,
    color: colors.white,
  },
  button: {
    width: width * 0.3,
  },
  profileImageContainer: {
    height: height * 0.14,
    position: 'relative',
    marginBottom: 6,
  },
  profileImage: {
    width: height * 0.14,
    height: height * 0.14,
    borderRadius: height * 0.07,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.black,
    position: 'relative',
  },
  profileImageData: {
    width: height * 0.14,
    height: height * 0.14,
    borderRadius: height * 0.07,
    borderWidth: 1,
    borderColor: colors.white,
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 30,
  },
  editIcon: {
    backgroundColor: colors.black2,
    fontSize: 18,
    borderRadius: 14,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.7,
  },
  loading: {
    position: 'absolute',
    top: '40%',
    left: '40%',
  },
  coverImageContainer: {
    // flex: 1,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    height: 170,
  },
})
