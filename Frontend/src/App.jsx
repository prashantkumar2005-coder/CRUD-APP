import './App.css'
import Library from './Library'
import { Login } from './Pages/Login'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './Pages/Navbar'
import Register from './Pages/Register'
import { Protected } from './Components/Protected'
import  Store  from './Pages/Store'
import { Home } from './Pages/Home'



function App() {

  return (
//     <>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/Register" element={<Register />} />
//         {/* Protected Route */}
//         <Route element={<Protected />}>
//           <Route path="/Store" element={<Store />} />
//         </Route>
//       </Routes>

//     </>
  <>
   <Library />
</> )
 }

export default App
