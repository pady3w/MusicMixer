import About from './components/MoreInfo/About';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header';
import Home from './components/home/Home';
import Footer from './components/layout/Footer';
import LyricGeneration from './components/LyricGeneration/LyricGeneration'
import GeneratedCatalog from './components/GeneratedCatalog/GeneratedCatalog'
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lyric-generation" element={<LyricGeneration />} />
              <Route path="/catalog" element={<GeneratedCatalog />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <Footer/>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;