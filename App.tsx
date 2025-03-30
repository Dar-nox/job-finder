import 'react-native-get-random-values'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider } from './context/ThemeContext'
import JobFinderScreen from './screens/JobFinderScreen'
import SavedJobsScreen from './screens/SavedJobsScreen'
import ApplicationFormModal from './screens/ApplicationFormModal'

const Stack = createStackNavigator()

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false)

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="JobFinder"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="JobFinder">
            {() => (
              <JobFinderScreen
                onApply={() => setModalVisible(true)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
        </Stack.Navigator>
        <ApplicationFormModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      </NavigationContainer>
    </ThemeProvider>
  )
}
