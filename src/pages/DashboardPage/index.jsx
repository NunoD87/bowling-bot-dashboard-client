import "./styles.css";

import { Skeleton } from "primereact/skeleton";
import { React } from "react";

import GuildsSide from "../../components/GuildsSide";
import { useGuilds } from "../../context/guilds.context";
import { useUser } from "../../context/user.context";

function DashboardPage() {
  const { user } = useUser();
  const { isLoading } = useGuilds();

  if (!user?.discord)
    return (
      <>
        <div className="flex flex-column ml-8 mt-7">
          <h1>Not logged in with Discord</h1>
          <a
            href={
              "https://discord.com/api/oauth2/authorize?client_id=1033309123577647144&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.members.read"
            }
          >
            Login with Discord
          </a>
        </div>
      </>
    );

  if (isLoading)
    return (
      <>
        <GuildsSide />
        <div className="flex w-screen h-16rem ml-8 mt-7">
          <div className="m-auto">
            <Skeleton width="300px" height="50px" />
          </div>
        </div>
      </>
    );

  return (
    <>
      <GuildsSide />
      <div className="flex w-screen h-16rem ml-8 mt-7">
        <div className="m-auto">
          <p className="text-5xl">Select a server</p>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
