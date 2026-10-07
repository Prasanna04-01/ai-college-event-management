import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardLayout from './layouts/DashboardLayout'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import DashboardPlaceholder from './pages/DashboardPlaceholder'
import EventDetail from './pages/EventDetail'
import Events from './pages/Events'
import Feedback from './pages/Feedback'
import Home from './pages/Home'
import Login from './pages/Login'
import MyEvents from './pages/MyEvents'
import NotificationsPage from './pages/NotificationsPage'
import Profile from './pages/Profile'
import Register from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route
          path="/recommendations"
          element={
            <DashboardPlaceholder
              title="Recommendations"
              description="Personalized AI event recommendations will live here. For now, browse featured matches from the dashboard."
            />
          }
        />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/settings"
          element={
            <DashboardPlaceholder
              title="Settings"
              description="Account and notification settings will be added later."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
