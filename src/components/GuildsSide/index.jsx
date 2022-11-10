import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

import { useGuilds } from "../../context/guilds.context";
import { useUser } from "../../context/user.context";

function GuildsSide() {
  const { user } = useUser();
  const { guilds, isLoading } = useGuilds();

  if (isLoading || !guilds) {
    const skeletonGuilds = [];

    for (let i = 0; i < 20; i++) {
      skeletonGuilds.push(
        <li key={i} className="px-2 py-1">
          <Skeleton shape="circle" size="55px" />
        </li>
      );
    }

    return (
      <>
        {user?.discord && (
          <div className="discord fixed max-h-screen overflow-y-scroll mt-8">
            <ul className="list-none p-0 m-0">{skeletonGuilds}</ul>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {user?.discord && (
        <div className="discord fixed h-screen overflow-y-scroll mt-8 ">
          <ul className="guilds list-none p-0 m-0">
            {guilds?.map((guild, i) => (
              <li
                key={guild.id}
                className={`${
                  i === 1
                    ? "px-2 pb-1"
                    : i === guilds.length - 1
                    ? "px-2 py-1 mb-8"
                    : "px-2 py-1"
                }`}
                tooltip={guild.name}
              >
                <Tooltip target={`.avatar-${guild.id}`} content={guild.name} />

                <Link to={`/guild/${guild.id}`}>
                  <Avatar
                    image={
                      guild.icon ? guild.icon : "/images/discord-default.png"
                    }
                    shape="circle"
                    size="large"
                    className={
                      !guild.isBotIn
                        ? `bw hoverG avatar-${guild.id}`
                        : `hoverG avatar-${guild.id}`
                    }
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default GuildsSide;
