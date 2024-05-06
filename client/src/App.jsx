import './App.css';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import Explore from './components/Explore';
import Podcasts from './components/Podcasts';
import Concerts from './components/Concerts';
import Register from './components/register';
import {  Routes, Route , Link} from "react-router-dom";

function App() {

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Layout><SearchBar /></Layout>} />
          <Route path="explore" element={<Layout><Explore /></Layout>} />
          <Route path="podcasts" element={<Layout><Podcasts /></Layout>}></Route>
          <Route path="events" element={<Layout><Concerts /></Layout>}></Route>
          <Route path="register" element={<Register></Register>}></Route>
        </Routes>
    </div>
  );
}

export default App;
