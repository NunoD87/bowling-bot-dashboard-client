import { React, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useToasts } from "../context/toasts.context";
import { useUser } from "../context/user.context";

function HandleDiscord() {
  const { showToast } = useToasts();
  const { handleDiscord } = useUser();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const guildId = searchParams.get("guild_id");

  const navigate = useNavigate();

  useEffect(() => {
    const connectDiscord = async () => {
      if (!code) navigate("/", { replace: true });
      const data = await handleDiscord(code, guildId);
      if (data.guildId) {
        navigate(`/guild/${data.guildId}`, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    };

    connectDiscord();
  }, [code, guildId, handleDiscord, navigate, showToast]);

  return <></>;
}

export default HandleDiscord;
