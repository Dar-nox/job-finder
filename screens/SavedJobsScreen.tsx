import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ApplicationFormModal from './ApplicationFormModal';

const SavedJobsScreen = ({ savedJobs, removeJobFromSaved, navigation, appliedJobs = [], markJobAsApplied }) => {
  const { isDarkMode } = useTheme(); // Use ThemeContext for dark mode

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  const handleApply = (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, isDarkMode ? styles.darkText : styles.lightText]}>Saved Jobs</Text>
      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isApplied = appliedJobs.includes(item.id); // Check if the job is already applied
            return (
              <View style={[styles.jobCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.jobTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.company}</Text>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.salary}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.removeButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={() => removeJobFromSaved(item.id)} // Use the centralized function to remove jobs
                  >
                    <Text style={[styles.buttonText]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.applyButton, isApplied && styles.disabledButton]} // Apply disabled style if already applied
                    onPress={() => !isApplied && handleApply(item.id, item.title)} // Disable onPress if already applied
                    disabled={isApplied} // Disable button if already applied
                  >
                    <Text style={[styles.buttonText]}>
                      {isApplied ? 'Applied' : 'Apply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text style={[styles.noJobsText, isDarkMode ? styles.darkText : styles.lightText]}>No saved jobs available.</Text>
      )}
      <ApplicationFormModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        fromSavedJobs={true} // Indicate the modal is opened from SavedJobsScreen
        navigation={navigation}
        jobId={selectedJobId}
        jobTitle={selectedJobTitle}
        isDarkMode={isDarkMode}
        markJobAsApplied={markJobAsApplied} // Pass function to mark jobs as applied
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 16,
  },
  jobCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#0C121D',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#e0e0e0',
  },
  lightCard: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
  },
  darkCard: {
    backgroundColor: '#1E2B40',
    borderColor: '#334663',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#4B6387',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc', // Gray out the button
  },
  buttonText: {
    color: '#fff',    // Always white text
    fontWeight: 'bold',
    fontSize: 16,
  },
  noJobsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SavedJobsScreen;
