import { AxiosError } from "axios";
import { React, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useToasts } from "../context/toasts.context";
import { useUser } from "../context/user.context";
import { ToastLife, ToastSeverity } from "./enums";

function HandleDiscord() {
  const { showToast } = useToasts();
  const { handleDiscord } = useUser();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const navigate = useNavigate();

  useEffect(() => {
    const connectDiscord = async () => {
      if (!code) navigate("/", { replace: true });
      const data = await handleDiscord(code);
      showToast({
        severity: `${
          data instanceof AxiosError
            ? ToastSeverity.Error
            : ToastSeverity.Success
        }`,
        summary: `${
          data instanceof AxiosError ? "Error" : "Discord connected"
        }`,
        detail: `${
          data instanceof AxiosError
            ? data.response.data.message
            : data.data.message
        }`,
        life: `${
          data instanceof AxiosError ? ToastLife.Error : ToastLife.Success
        }`,
      });
      navigate("/dashboard", { replace: true });
    };

    connectDiscord();
  }, [code, handleDiscord, navigate, showToast]);

  return <></>;
}

export default HandleDiscord;
