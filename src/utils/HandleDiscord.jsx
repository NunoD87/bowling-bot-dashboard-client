import { React, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useToasts } from "../context/toasts.context";
import { useUser } from "../context/user.context";
import { ToastSeverity } from "./enums";

function HandleDiscord() {
  const { showToast } = useToasts();
  const { handleDiscord } = useUser();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const navigate = useNavigate();

  useEffect(() => {
    if (!code) navigate("/");

    try {
      handleDiscord(code);
      navigate("/dashboard");
      showToast({
        severity: ToastSeverity.Success,
        summary: "Discord connected successfully",
        detail: "You connected your Discord successfully.",
        life: 2000,
      });
    } catch (error) {
      navigate("/dashboard");
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: "An error occurred while connecting your Discord.",
        life: 2000,
      });
    }
  }, [code, handleDiscord, navigate, showToast]);

  return <></>;
}

export default HandleDiscord;
