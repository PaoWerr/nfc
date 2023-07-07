import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import NfcManager, { NfcEvents, NfcTech, Ndef } from 'react-native-nfc-manager';
import Modal from 'react-native-modal';

const NFCReader = () => {
    const [hasNfc, setHasNFC ] = useState(null);
    const [tagData, setTagData] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isWriteModalVisible, setWriteModalVisible] = useState(false);


    useEffect(() => {
        const checkIsSupported = async () => {
          const deviceIsSupported = await NfcManager.isSupported()
    
          setHasNFC(deviceIsSupported)
          if (deviceIsSupported) {
            await NfcManager.start()
          }
        }
    
        checkIsSupported()
      }, [])

      useEffect(() => {
        const handleDiscoverTag = (tag) => {
            console.log('Tag Found:', tag);
            setTagData(JSON.stringify(tag));
            setModalVisible(false);
          };
      
          NfcManager.setEventListener(NfcEvents.DiscoverTag, handleDiscoverTag);
      
          return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
            NfcManager.unregisterTagEvent(); // Unregister the tag event when the component unmounts
          };
      }, [])
    
    
      const readTag = async () => {
        if (isModalVisible) {
            return; // Don't register another tag event if scanning is already in progress
          }
        try {
          await NfcManager.registerTagEvent();
          setModalVisible(true);
        } catch (ex) {
          console.warn('Error reading tag', ex);
        }
      };
    
      const cancelReadTag = async () => {
        try {
          await NfcManager.unregisterTagEvent();
        } catch (ex) {
          console.warn('Error canceling tag read', ex);
        }
      };



      //write data

      const writeNFC = async() => {
        if (isWriteModalVisible) {
          return; // Don't initiate another write operation if writing is already in progress
        }
        setWriteModalVisible(true);
    
        try {
          await NfcManager.requestTechnology(NfcTech.Ndef);
    
          const bytes = Ndef.encodeMessage([Ndef.uriRecord('https://blog.logrocket.com/')]);
    
          if (bytes) {
            await NfcManager.ndefHandler
              .writeNdefMessage(bytes);
            result = true;
          }
        } catch (ex) {
          console.warn(ex);
        } finally {
          NfcManager.cancelTechnologyRequest();
          setWriteModalVisible(false);
          
        }
    
        
      }

      if (hasNfc === null) return null;

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text>NFC not supported</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Text>NFC READER</Text>
      <TouchableOpacity style={[styles.btn, styles.btnScan]} onPress={readTag}>
        <Text style={{ color: "white" }}>Scan Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnWrite]} onPress={writeNFC}>
        <Text style={{ color: "white" }}>Write Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={cancelReadTag}>
        <Text style={{ color: "white" }}>Cancel Scan</Text>
      </TouchableOpacity>
      {tagData !== '' && (
        <View style={styles.tagDataContainer}>
            <Text style={styles.tagDataTitle}>Tag Data:</Text>
            <Text style={styles.tagDataText}>{tagData}</Text>
        </View>
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Please place your NFC tag near the device for reading.</Text>
        </View>
      </Modal>
      <Modal isVisible={isWriteModalVisible} onBackdropPress={() => setWriteModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Please place your NFC tag near the device for writing.</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
  }
  const styles = StyleSheet.create ({
    sectionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      btn: {
        width: 200,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
    btnScan: {
        backgroundColor: 'green',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      btnWrite: {
        backgroundColor: 'green',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      btnCancel: {
        backgroundColor: 'red',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      tagDataContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
      },
      tagDataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        alignSelf: 'center'
      },
      tagDataText: {
        fontSize: 16,
        lineHeight: 24,
        color: 'black'
      },
      modalContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 20,
        width: 250,
        height: 300,
      },
      modalText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'black'
      },
  });
export default NFCReader;
