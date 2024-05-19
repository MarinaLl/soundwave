import './App.css';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import Explore from './components/Explore';
import Podcasts from './components/Podcasts';
import Concerts from './components/Concerts';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Library from './components/Library';
import Playlists from './components/Playlists';
import Playlist from './components/Playlist';
import Liked from './components/Liked';
import {  Routes, Route , Link} from "react-router-dom";

function App() {

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Layout><SearchBar /></Layout>} />
          <Route path="search" element={<Layout><SearchBar /></Layout>} />
          <Route path="explore" element={<Layout><Explore /></Layout>} />
          <Route path="podcasts" element={<Layout><Podcasts /></Layout>}></Route>
          <Route path="events" element={<Layout><Concerts /></Layout>}></Route>
          <Route path="register" element={<Register></Register>}></Route>
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="profile" element={<Layout><Profile /></Layout>}></Route>
          <Route path="library" element={<Layout><Library /></Layout>}></Route>
          <Route path="playlists" element={<Layout><Playlists /></Layout>}></Route>
          <Route path="playlist/:playlistId" element={<Layout><Playlist /></Layout>}></Route>
          <Route path="favSongs" element={<Layout><Liked /></Layout>}></Route>
        </Routes>
    </div>
  );
}

export default App;
