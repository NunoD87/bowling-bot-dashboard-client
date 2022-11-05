import { createContext, useContext, useEffect, useState } from "react";

import guildsService from "../services/guilds.service";
import { useUser } from "./user.context";

const GuildsContext = createContext();

export default function GuildsWrapper({ children }) {
  const { user } = useUser();
  const [guilds, setGuilds] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  function getGuild(guildId) {
    if (!guilds) return undefined;

    return guilds.find((guild) => guild.id === guildId);
  }

  async function getGuilds() {
    try {
      setIsLoading(true);
      const { data } = await guildsService.getGuilds();
      setGuilds(data);
    } catch ({ data: { message } }) {
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.discord && !guilds) getGuilds();
  }, [user?.discord, guilds]);

  return (
    <GuildsContext.Provider value={{ guilds, isLoading, getGuild }}>
      {children}
    </GuildsContext.Provider>
  );
}

export function useGuilds() {
  return useContext(GuildsContext);
}
