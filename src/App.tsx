import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WorkoutProvider } from './context/WorkoutContext'
import BottomNav from './components/layout/BottomNav'
import HomeScreen from './screens/HomeScreen'
import ActiveWorkout from './screens/ActiveWorkout'
import WorkoutSummary from './screens/WorkoutSummary'
import HistoryScreen from './screens/HistoryScreen'
import RoadmapScreen from './screens/RoadmapScreen'
import PosturalScreen from './screens/PosturalScreen'
import DataScreen from './screens/DataScreen'

export default function App() {
  return (
    <WorkoutProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workout/:date" element={<ActiveWorkout />} />
          <Route path="/summary/:date" element={<WorkoutSummary />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/roadmap" element={<RoadmapScreen />} />
          <Route path="/postural" element={<PosturalScreen />} />
          <Route path="/data" element={<DataScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </HashRouter>
    </WorkoutProvider>
  )
}
