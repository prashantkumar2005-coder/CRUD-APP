import './App.css'
import Library from './Library'
import { Login } from './Pages/Login'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './Pages/Navbar'
import Register from './Pages/Register'
import { Protected } from './Components/Protected'
import { Home } from './Pages/Store'



function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        {/* Protected Route */}
        <Route element={<Protected />}>
          <Route path="/" element={<Store />} />
        </Route>
      </Routes>

      {/* //   <Library /> */}
    </>
  )
}

export default App
