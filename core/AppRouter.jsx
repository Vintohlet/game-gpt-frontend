import { Routes, Route } from 'react-router-dom';
import AuthPage from '../src/pages/AuthPage';
import ChatPage from '../src/pages/ChatPage';
import NotFoundPage from '../src/pages/NotFoundPage';
import { ProtectedRoute } from '../src/components/ProtectedRoute';

export default function AppRouter() {
 return (
<Routes>
 <Route path="/auth" element={<AuthPage />} />
 <Route path="/" element={
 <ProtectedRoute> 
 <ChatPage />
</ProtectedRoute>
 } />
 <Route path="*" element={<NotFoundPage />} />
</Routes>
 );
}