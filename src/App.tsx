import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminSettings from './pages/AdminSettings';
import AdminLandingEditor from './pages/AdminLandingEditor';
import AdminFooterSettings from './pages/AdminFooterSettings';
import AdminFormSettings from './pages/AdminFormSettings';
import AdminEmailSettings from './pages/AdminEmailSettings';
import AdminPopups from './pages/AdminPopups';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PopupModal from './components/PopupModal';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<AdminPostEditor />} />
          <Route path="posts/edit/:id" element={<AdminPostEditor />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="landing-editor" element={<AdminLandingEditor />} />
          <Route path="footer-settings" element={<AdminFooterSettings />} />
          <Route path="form-settings" element={<AdminFormSettings />} />
          <Route path="email-settings" element={<AdminEmailSettings />} />
          <Route path="popups" element={<AdminPopups />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPage && (
        <>
          <FloatingWhatsApp />
          <PopupModal />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
