import "./styles.css";

import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/auth.service";
import { useState } from "react";
import { useUser } from "../../context/user.context";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { authenticate } = useUser();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      const result = await authService.login(form);
      authenticate(result.data);
      navigate("/");
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className='LoginPage'>
      <h1>Login</h1>

      <form onSubmit={handleSubmission}>
        <label>Email:</label>
        <input
          type='email'
          name='email'
          value={form.email}
          onChange={handleChanges}
        />

        <label>Password:</label>
        <input
          type='password'
          name='password'
          value={form.password}
          onChange={handleChanges}
        />

        <button type='submit'>Login</button>
      </form>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up</Link>
    </div>
  );
}

export default LoginPage;
