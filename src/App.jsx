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
import Collection from './pages/Collection';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import TopicAudit from './pages/TopicAudit';
import AuthorProfile from './pages/AuthorProfile';
import AIGenerator from './pages/AIGenerator';
import ConfigManagement from './pages/ConfigManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="collection" element={<Collection />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<AuthorProfile />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="upload" element={<Upload />} />
          <Route path="ai" element={<AIGenerator />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/tags" element={<TagManagement />} />
          <Route path="settings/categories" element={<CategoryManagement />} />
          <Route path="settings/images" element={<ImageManagement />} />
          <Route path="settings/topics-audit" element={<TopicAudit />} />
          <Route path="settings/config" element={<ConfigManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
