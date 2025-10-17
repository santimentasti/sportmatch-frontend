import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'

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

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Rutas Protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/sports" 
          element={
            <ProtectedRoute>
              <Layout>
                <SportSelection />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/sport-profile" 
          element={
            <ProtectedRoute>
              <Layout>
                <SportProfile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/matching/:sportId" 
          element={
            <ProtectedRoute>
              <Layout>
                <Matching />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatList />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat/:conversationId" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatWindow />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/venues" 
          element={
            <ProtectedRoute>
              <Layout>
                <VenueMap />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/matches" 
          element={
            <ProtectedRoute>
              <Layout>
                <Matches />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile/stats" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProfileEnhanced />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* 404 y Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App 