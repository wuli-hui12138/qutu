import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import TagManagement from './pages/TagManagement';
import CategoryManagement from './pages/CategoryManagement';
import ImageManagement from './pages/ImageManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="upload" element={<Upload />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/tags" element={<TagManagement />} />
          <Route path="settings/categories" element={<CategoryManagement />} />
          <Route path="settings/images" element={<ImageManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
