import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';

interface ApplicationFormModalProps {
  visible: boolean;
  onClose: () => void;
  fromSavedJobs?: boolean; // Indicates if the modal is opened from SavedJobsScreen
  navigation?: any; // Navigation prop for redirection
  jobId: string; // Job ID for marking as applied
  jobTitle: string; // Job title for display
  isDarkMode: boolean; // Add isDarkMode prop
  markJobAsApplied: (jobId: string) => void; // Function to mark job as applied
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ visible, onClose, fromSavedJobs, navigation, jobId, jobTitle, isDarkMode, markJobAsApplied }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!contactNumber.trim() || !phoneRegex.test(contactNumber)) {
      Alert.alert('Error', 'Please enter a valid contact number (10-15 digits).');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Reason is required.');
      return;
    }

    // Simulate form submission
    Alert.alert(
      'Application Submitted',
      'Your application has been submitted successfully!',
      [
        {
          text: 'Okay',
          onPress: () => {
            markJobAsApplied(jobId); // Use jobId for marking as applied
            if (fromSavedJobs && navigation) {
              navigation.navigate('JobFinder'); // Redirect to JobFinderScreen
            }
            onClose(); // Close the modal
          },
        },
      ]
    );

    // Clear the form
    setName('');
    setEmail('');
    setContactNumber('');
    setReason('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}> {/* Use a single overlay style */}
        <View style={[styles.modalContainer, isDarkMode ? styles.darkModal : styles.lightModal]}>
          <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Application Form</Text>
          <Text style={[styles.jobTitleText, isDarkMode ? styles.darkText : styles.lightText]}>
            <Text style={styles.label}>Job Title: </Text>
            {jobTitle} {/* Display the job title */}
          </Text>
          <TextInput
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Name"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Contact Number"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.textArea, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Why should we hire you?"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={reason}
            onChangeText={setReason}
            multiline={true}
            numberOfLines={4}
          />
          <View style={styles.buttonContainer}> {/* New container for buttons */}
            <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, isDarkMode ? styles.darkButton : styles.lightButton]}>
              <Text style={[styles.submitButtonText, isDarkMode ? styles.darkText : styles.lightText]}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, isDarkMode ? styles.darkButton : styles.lightButton]}>
              <Text style={[styles.closeButtonText, isDarkMode ? styles.darkText : styles.lightText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal at the bottom
  },
  modalContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  lightModal: {
    backgroundColor: 'white',
  },
  darkModal: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  lightInput: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
  },
  darkInput: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff', // Set text color to white in dark mode
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons side by side
    justifyContent: 'space-between', // Add space between buttons
    marginTop: 10,
  },
  submitButton: {
    flex: 1, // Allow buttons to share space equally
    marginRight: 5, // Add spacing between buttons
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    flex: 1, // Allow buttons to share space equally
    marginLeft: 5, // Add spacing between buttons
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
});

export default ApplicationFormModal;
