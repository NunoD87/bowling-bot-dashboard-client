import "./styles.css";

import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/auth.service";
import { useState } from "react";

function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      await authService.signup(form);
      navigate("/login");
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className='SignupPage'>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmission}>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChanges}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChanges}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type='password'
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChanges}
          />
        </label>
        <br />
        <button type='submit'>Sign Up</button>
      </form>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;
