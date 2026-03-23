import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';
import Reader from './pages/Reader';
import Login from './pages/Login';
import Bookmarks from './pages/Bookmarks';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Main Content */}
          <div className="app-content">
            <Navbar />
            
            <main className="app-main">
              <div className="page-container">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/item/:id" element={<ItemDetails />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/reader/:id" 
                    element={
                      <ProtectedRoute>
                        <Reader />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bookmarks" 
                    element={
                      <ProtectedRoute>
                        <Bookmarks />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/*" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </main>

            {/* Footer Note (Optional) */}
            <div className="app-footer-note">
              <div className="footer-gradient"></div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;