import "./styles.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useToasts } from "../../context/toasts.context";
import { useUser } from "../../context/user.context";
import authService from "../../services/auth.service";
import { ToastLife, ToastSeverity } from "../../utils/enums";

function LoginPage() {
  const { showToast } = useToasts();
  const { authenticate } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      const { data } = await authService.login(form);
      authenticate(data);
      showToast({
        severity: ToastSeverity.Success,
        summary: "Login successful",
        detail: "You have been logged in successfully.",
        life: ToastLife.Success,
      });
      navigate("/dashboard");
    } catch (error) {
      const errorDescription = error.response.data.message;
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: errorDescription,
        life: ToastLife.Error,
      });
    }
  };

  return (
    <div className="flex flex-column align-items-center w-screen mt-7">
      <h1>Login</h1>

      <form onSubmit={handleSubmission}>
        <div className="my-3">
          <label>
            <h4 className="m-0">Email</h4>
            <InputText
              name="email"
              value={form.email}
              keyfilter="email"
              onChange={handleChanges}
              className="pr-5"
            />
          </label>
        </div>

        <div className="my-3">
          <label>
            <h4 className="m-0">Password</h4>
            <Password
              name="password"
              value={form.password}
              onChange={handleChanges}
              toggleMask
              feedback={false}
            />
          </label>
        </div>

        <Button label="Login" className="p-button-sm" />
      </form>

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up</Link>
    </div>
  );
}

export default LoginPage;
