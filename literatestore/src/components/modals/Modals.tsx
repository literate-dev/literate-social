import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../redux/hooks';
import ProfileModal from './ProfileModal';

const Modals = () => {
    const modalTitle = useAppSelector(state => state.modal.title)
    const modalDetails = useAppSelector(state => state.modal.modalDetails)
    switch (modalTitle) {
        case "Profile":
            return <ProfileModal details={modalDetails} />
        default:
            return <View></View>
            break;
    }
}

export default Modals

const styles = StyleSheet.create({})