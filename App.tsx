import 'react-native-get-random-values';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Import ThemeContext
import JobFinderScreen from './screens/JobFinderScreen';
import SavedJobsScreen from './screens/SavedJobsScreen';
import ApplicationFormModal from './screens/ApplicationFormModal';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const Stack = createStackNavigator();

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]); // Centralize savedJobs state
  const [appliedJobs, setAppliedJobs] = useState([]); // Centralize appliedJobs state
  const { isDarkMode } = useTheme(); // Use ThemeContext to get the current theme
  const [jobs, setJobs] = useState([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (jobsLoaded) return; // Skip if already loaded
    setLoading(true);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      let jobsWithIds = [];
      if (Array.isArray(data)) {
        jobsWithIds = data.map((job) => ({ ...job, id: uuidv4() }));
      } else if (data.jobs && Array.isArray(data.jobs)) {
        jobsWithIds = data.jobs.map((job) => ({ ...job, id: uuidv4() }));
      }
      setJobs(jobsWithIds);
      setJobsLoaded(true);
    } catch (error) {
      // ...existing error handling...
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const addJobToSaved = (job) => {
    if (!savedJobs.some((savedJob) => savedJob.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const removeJobFromSaved = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  const markJobAsApplied = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="JobFinder"
          screenOptions={{
            headerShown: false, // Hide headers for a cleaner modal experience
            cardStyle: {
              backgroundColor: isDarkMode ? '#0C121D' : '#f5f5f5', // Match the theme's background color
            },
          }}
        >
          <Stack.Screen name="JobFinder">
            {(props) => (
              <JobFinderScreen
                {...props}
                jobs={jobs}              // Pass the loaded jobs
                loading={loading}        // Pass loading state
                savedJobs={savedJobs}
                addJobToSaved={addJobToSaved} // Pass function to add jobs
                appliedJobs={appliedJobs} // Pass appliedJobs state
                markJobAsApplied={markJobAsApplied} // Pass function to mark jobs as applied
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SavedJobs">
            {(props) => (
              <SavedJobsScreen
                {...props}
                savedJobs={savedJobs}
                removeJobFromSaved={removeJobFromSaved} // Pass function to remove jobs
                appliedJobs={appliedJobs} // Pass appliedJobs state
                markJobAsApplied={markJobAsApplied} // Pass function to mark jobs as applied
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>

        {/* Remove or comment out this unused modal */}
        {/* <ApplicationFormModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          markJobAsApplied={markJobAsApplied}
        /> */}
      </NavigationContainer>
    </ThemeProvider>
  );
}
