import React, { useState } from 'react'
import api from '../../services/api';

export default function Register() {
    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/register", register);
              setRegister({
                name: "",
                email: "",
                password: ""
            });
            alert(`Hello ,${register.name} Your Account Has been Created`)
          

        } catch (err) {
            const { response } = err;
            alert(response.data.message)
        }
    }

    // make once user is register send alert and form fir sai khali ho jaye

    const handleChange = (e) => {
        const { name, value } = e.target
        setRegister((prev) => ({
            ...prev,
            [name]: value,
        }))
    }


    return (
        <>
            <div className="login-wrapper">
                <div className="login-card">
                    <p className="login-eyebrow">Create Account</p>
                    <h1 className="login-title">Register in to your account</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label className="field-label">Name </label>
                            <input className="field-input" type="name" name="name" value={register.name} onChange={handleChange} placeholder="enter your name" required />
                        </div>
                        //
                        <div className="field-group">
                            <label className="field-label">Email Address</label>
                            <input className="field-input" type="email" name="email" value={register.email} onChange={handleChange} placeholder="you@example.com" required />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Password</label>
                            <input className="field-input" type="password" name="password" value={register.password} onChange={handleChange} required />
                        </div>
                        <button className="submit-btn" type="submit">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}
