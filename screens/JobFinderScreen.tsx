import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import ApplicationFormModal from './ApplicationFormModal';
import { useTheme } from '../context/ThemeContext'; // Import ThemeContext
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

interface JobFinderScreenProps {
  onApply: () => void;
  savedJobs: any[];
  addJobToSaved: (job: any) => void;
  appliedJobs: string[]; // Add appliedJobs prop
  markJobAsApplied: (jobId: string) => void; // Add markJobAsApplied prop
  jobs: any[];       // Receive jobs from App.tsx
  loading: boolean;  // Receive loading from App.tsx
}

const JobFinderScreen: React.FC<JobFinderScreenProps> = ({
  navigation,
  jobs,
  loading,
  savedJobs,
  addJobToSaved,
  appliedJobs,
  markJobAsApplied
}) => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use ThemeContext for dark mode

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(''); // Track selected job ID
  const [selectedJobTitle, setSelectedJobTitle] = useState(''); // Track selected job title

  const saveJob = (job) => {
    const isAlreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);
    if (!isAlreadySaved) {
      addJobToSaved(job); // Add job to saved jobs
    }
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    setModalVisible(true);
    setSelectedJobId(jobId); // Pass jobId for marking as applied
    setSelectedJobTitle(jobTitle); // Pass jobTitle for display in the modal
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, isDarkMode ? styles.darkText : styles.lightText]}>Job Finder</Text>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={toggleTheme} // Use toggleTheme from ThemeContext
        >
          <Text style={styles.themeButtonText}>{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.searchBar, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Search jobs..."
        placeholderTextColor={isDarkMode ? styles.darkPlaceholder.color : styles.lightPlaceholder.color}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.savedJobsButton}
        onPress={() => navigation.navigate('SavedJobs')} // No need to pass savedJobs explicitly
      >
        <Text style={styles.savedJobsButtonText}>Go to Saved Jobs</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? styles.darkActivityIndicator.color : styles.lightActivityIndicator.color} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isApplied = appliedJobs.includes(item.id); // Check if the job is already applied
            const isSaved = savedJobs.some((savedJob) => savedJob.id === item.id); // Check if the job is already saved
            return (
              <View style={[styles.jobCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.jobTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.company}</Text>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.salary}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.saveButton, isSaved && styles.disabledButton]} // Apply disabled style if already saved
                    onPress={() => !isSaved && saveJob(item)} // Disable onPress if already saved
                    disabled={isSaved} // Disable button if already saved
                  >
                    <Text style={styles.saveButtonText}>{isSaved ? 'Saved' : 'Save Job'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.applyButton, isApplied && styles.disabledButton]} // Apply disabled style if already applied
                    onPress={() => !isApplied && handleApply(item.id, item.title)} // Pass jobId and jobTitle
                    disabled={isApplied} // Disable button if already applied
                  >
                    <Text style={styles.applyButtonText}>{isApplied ? 'Applied' : 'Apply'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
      <ApplicationFormModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        jobId={selectedJobId} // Pass jobId for marking as applied
        jobTitle={selectedJobTitle} // Pass jobTitle for display
        fromSavedJobs={false}
        navigation={navigation}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#0C121D',
    borderColor: '#1E2B40',
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
  lightInput: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
  },
  darkInput: {
    backgroundColor: '#0C121D',
    borderColor: '#1E2B40',
    color: '#fff',
  },
  lightCard: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
  },
  darkCard: {
    backgroundColor: '#1E2B40',
    borderColor: '#334663',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: -20,
  },
  saveButton: {
    backgroundColor: '#4B6387',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // Add spacing between buttons
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#4B6387',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeButton: {
    backgroundColor: '#4B6387',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  darkPlaceholder: {
    color: '#ccc',
  },
  lightPlaceholder: {
    color: '#666',
  },
  darkActivityIndicator: {
    color: '#fff',
  },
  lightActivityIndicator: {
    color: '#000',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedJobsButton: {
    backgroundColor: '#4B6387',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  savedJobsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Gray out the button
  },
});

export default JobFinderScreen;
