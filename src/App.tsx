import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Quiz from './pages/Quiz'
import Topics from './pages/Topics'

// HashRouter keeps links working on any static host with no server setup.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:subject/:year" element={<Topics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/quiz/:subject/:year/:topicId" element={<Quiz />} />
      </Routes>
    </HashRouter>
  )
}
