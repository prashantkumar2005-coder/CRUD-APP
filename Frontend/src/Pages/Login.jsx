import React, { useState } from 'react'
import api from '../../services/api'
export const Login = () => {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const handleSubmit = async(e) => {
        e.preventDefault()
        // page ko rerender nahi krta
        try {
            const response =  await api.post("/auth/login", login);
             console.log(response);

            if(response.data.success){
            setLogin({
                email: "",
                password: ""
            })
            localStorage.setItem("token" , response.data.token)
            alert(`welcome ${login.email}`)
            }else{
                alert(response.data.message)
            }
           
        } catch (err) {
                        const { response } = err;

            console.log("login err : " , response);
            alert(response.data.message || "Something Wrong")
           
        }

    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setLogin((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    return (
        <>
            <div className="login-wrapper">
                <div className="login-card">
                    <p className="login-eyebrow">Welcome </p>
                    <h1 className="login-title">Sign in to your account</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label className="field-label">Email Address</label>
                            <input className="field-input" type="email" name="email" value={login.email} onChange={handleChange} placeholder="you@example.com" required />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Password</label>
                            <input className="field-input" type="password" name="password" value={login.password} onChange={handleChange} placeholder="••••••••" required />
                        </div>
                        <button className="submit-btn" type="submit">Continue</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Login