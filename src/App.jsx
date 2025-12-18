import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import Collection from './pages/Collection';
import Upload from './pages/Upload';

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
          <Route path="collection/:tag" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
