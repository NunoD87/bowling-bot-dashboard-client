import "./styles.css";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToasts } from "../../context/toasts.context";
import authService from "../../services/auth.service";
import { ToastSeverity } from "../../utils/enums";

function SignupPage() {
  const { showToast } = useToasts();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const header = <h5>Pick a password</h5>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

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
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: errorDescription,
        life: 2000,
      });
    }
  };

  return (
    <div className="flex flex-column align-items-center w-screen mt-7">
      <h1>Sign Up</h1>

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
              header={header}
              footer={footer}
              toggleMask
            />
          </label>
        </div>

        <div className="my-3">
          <label>
            <h4 className="m-0">Confirm Password</h4>
            <Password
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChanges}
              toggleMask
              feedback={false}
            />
          </label>
        </div>

        <Button label="Sign Up" className="p-button-sm" />
      </form>
    </div>
  );
}

export default SignupPage;
