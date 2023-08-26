
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking
} from 'react-native';
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { useAppDispatch } from '../redux/hooks';
import { modalActions } from '../redux/slices/modalSlice';

const QRScanner = () => {
    const navigation = useNavigation()
    const dispatch = useAppDispatch()

    const route = useRoute()

    const onSuccess = async (e: any) => {
        const qrData = _.get(e, 'data', '')
        const currentUserId = auth().currentUser?.uid
        const document = fireStore().collection('QR').doc(currentUserId);
        const documents = await document.get()
        const collectionRef = fireStore().collection('QR');

        // checking the qr data exists or not
        collectionRef.where(qrData, '==', qrData).get()
            .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    if (_.get(route, 'params.type') === "get") {
                        Toast.show({ type: "error", text1: "No user exists with this qr code" })
                    } else {
                        await document.set({
                            ...documents.data(),
                            [qrData]: qrData
                        }).then(res => {
                            Toast.show({ type: 'success', text1: "Successfully updated the qr data" })
                            navigation.goBack()
                        }).catch(err => {
                            Toast.show({ type: 'error', text1: "Failed to read the qr data" })
                        })
                    }
                } else {

                    if (_.get(route, 'params.type') === "get") {

                        collectionRef.where(qrData, '==', qrData).get()
                            .then((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    Toast.show({ type: "error", text1: 'No documents found with the specified field value.' });
                                } else {
                                    // Toast.show({ type: "success", text1: "successfully fetched" })
                                    querySnapshot.forEach((doc) => {
                                        dispatch(modalActions.showModal({ title: "Profile", modalDetails: { documentId: doc.id } }))
                                        navigation.goBack()
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error('Error getting documents:', error);
                            });

                    } else {
                        Toast.show({ type: "error", text1: "Qr code already exists" })
                    }

                }
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    };

    return (
        <QRCodeScanner
            onRead={onSuccess}
            vibrate={true}
            reactivate
            reactivateTimeout={1000}
            topContent={
                <Text style={styles.centerText}>
                    Scan {' '}
                    <Text style={styles.textBold}>QR_code</Text>
                    {_.get(route, 'params.type') === "get" ? " to get the user details" : " to update the user"}
                </Text>
            }
        />
    );
}

export default QRScanner
const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});
