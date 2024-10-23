import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

const BatteryModal = ({ visible, onClose, onSubmit }) => {
    const [batteryPercentage, setBatteryPercentage] = useState('');
  
    const handleSubmit = () => {
      if (batteryPercentage) {
        onSubmit(batteryPercentage);
        setBatteryPercentage('');
        onClose();
      } else {
        Alert.alert('Please enter a valid battery percentage.');
      }
    };
  
    return (
      <Modal transparent={true} visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{color: 'black'}}>Please enter your battery percentage:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={batteryPercentage}
              onChangeText={setBatteryPercentage}
              placeholder="Battery percentage"
              placeholderTextColor={"gray"}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  export default BatteryModal;
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginVertical: 10,
      padding: 10,
      color:'black',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
  