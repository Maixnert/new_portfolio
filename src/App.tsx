import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { CaseStudy } from './pages/CaseStudy'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Privacy } from './pages/Privacy'
import { Services } from './pages/Services'
import { Work } from './pages/Work'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prace" element={<Work />} />
          <Route path="prace/:slug" element={<CaseStudy />} />
          <Route path="sluzby" element={<Services />} />
          <Route path="o-nas" element={<About />} />
          <Route path="kontakt" element={<Contact />} />
          <Route path="ochrana-udaju" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
