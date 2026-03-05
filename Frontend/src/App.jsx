import './App.css'

// import Library from './Library'
import { Login } from './Pages/Login'
import { Routes, Route } from 'react-router-dom'

import Register from './Pages/Register'
import { Protected } from './Components/Protected'
import Store from './Pages/Store'
import { Home } from './Pages/Home'
import Library from './Components/Library'



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        {/* Protected Route */}
        <Route element={<Protected />}>
          <Route path="/Store" element={<Store />} />
        </Route>
      </Routes>

      <>
        {/* <Library /> */}
      </>
    </>
  )
}
