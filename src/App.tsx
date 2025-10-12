import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { useStore } from './store/useStore'

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home.tsx'))
const SportSelection = lazy(() => import('./pages/SportSelection.tsx'))
const Matching = lazy(() => import('./pages/Matching.tsx'))
const Profile = lazy(() => import('./pages/Profile.tsx'))
const ProfileEnhanced = lazy(() => import('./pages/ProfileEnhanced.tsx'))
const SportProfile = lazy(() => import('./pages/SportProfile.tsx'))
const ChatList = lazy(() => import('./pages/ChatList.tsx'))
const ChatWindow = lazy(() => import('./pages/ChatWindow.tsx'))
const VenueMap = lazy(() => import('./pages/VenueMap.tsx'))
const Notifications = lazy(() => import('./pages/Notifications.tsx'))
const Matches = lazy(() => import('./pages/Matches.tsx'))
const Login = lazy(() => import('./pages/Login.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore()
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

function App() {
  const { isAuthenticated } = useStore()

  return (
    <>
      {isAuthenticated ? (
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sports" element={<SportSelection />} />
              <Route path="/sport-profile" element={<SportProfile />} />
              <Route path="/matching/:sportId" element={<Matching />} />
              <Route path="/chat" element={<ChatList />} />
              <Route path="/chat/:conversationId" element={<ChatWindow />} />
              <Route path="/venues" element={<VenueMap />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/stats" element={<ProfileEnhanced />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      )}
    </>
  )
}

export default App 