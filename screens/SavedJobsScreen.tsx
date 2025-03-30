import React, { useState } from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'

const SavedJobsScreen = ({ navigation }) => {
  const [savedJobs, setSavedJobs] = useState([])

  const removeJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId))
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text>{item.title}</Text>
            <Text>{item.company}</Text>
            <Button title="Remove Job" onPress={() => removeJob(item.id)} />
            <Button title="Apply" onPress={() => navigation.navigate('ApplicationForm', { job: item })} />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  jobCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 4
  }
})

export default SavedJobsScreen
