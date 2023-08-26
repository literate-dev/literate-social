import React, { Component, useState } from 'react';
import { Alert, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { modalActions } from '../../redux/slices/modalSlice';
import Modals from './Modals';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../constants/colors';
import Modal from 'react-native-modal'
const { height } = Dimensions.get("window")
const ModalComponent = () => {
    const dispatch = useAppDispatch()
    const modalVisible = useAppSelector((state) => state.modal.show)
    return (
        <Modal
            // animationType="fade"
            // transparent={true}
            isVisible={modalVisible}
            animationOut="fadeOut"
            animationIn={"fadeIn"}
            // onRequestClose={() => {
            //     dispatch(modalActions.hideModal());
            // }}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeIconContainer} onPress={() => dispatch(modalActions.hideModal())}>
                        <AntDesign name="close" style={styles.closeIcon} />
                    </TouchableOpacity>
                    <Modals />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        minHeight: height * 0.2,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        position: "relative",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    closeIconContainer: {
        position: 'absolute',
        right: 5,
        top: 5
    },
    closeIcon: {
        color: colors.black,
        fontSize: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 2
    }
});

export default ModalComponent;