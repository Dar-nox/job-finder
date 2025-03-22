import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import ApplicationFormModal from './ApplicationFormModal';

interface JobFinderScreenProps {
  onApply: () => void;
}

const JobFinderScreen: React.FC<JobFinderScreenProps> = ({ navigation, onApply }) => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://empllo.com/api/v1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const jobsWithIds = data.map((job) => ({ ...job, id: uuidv4() }));
          setJobs(jobsWithIds);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          const jobsWithIds = data.jobs.map((job) => ({ ...job, id: uuidv4() }));
          setJobs(jobsWithIds);
        } else {
          Alert.alert('Error', 'Unexpected API response format.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch jobs: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const saveJob = (job) => {
    if (!savedJobs.find((savedJob) => savedJob.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const handleApply = (jobTitle: string) => {
    setModalVisible(true);
    setSelectedJobTitle(jobTitle);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
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
          onPress={toggleTheme}
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
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? styles.darkActivityIndicator.color : styles.lightActivityIndicator.color} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.jobCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
              <Text style={[styles.jobTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.company}</Text>
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.salary}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => saveJob(item)}
                >
                  <Text style={styles.saveButtonText}>Save Job</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApply(item.title)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <ApplicationFormModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        jobTitle={selectedJobTitle}
        fromSavedJobs={false}
        navigation={navigation}
        isDarkMode={isDarkMode}
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
});

export default JobFinderScreen;
