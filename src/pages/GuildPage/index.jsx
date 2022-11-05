import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { Skeleton } from "primereact/skeleton";
import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GuildsSide from "../../components/GuildsSide";
import { useGuilds } from "../../context/guilds.context";
import { useToasts } from "../../context/toasts.context";
import configService from "../../services/config.service";
import historyService from "../../services/history.service.";
import { ToastSeverity } from "../../utils/enums";
import NotFoundPage from "../NotFoundPage";

function GuildPage() {
  const { guildId } = useParams();
  const { isLoading, getGuild } = useGuilds();
  const { showToast } = useToasts();

  const guild = getGuild(guildId);
  const [history, setHistory] = useState(undefined);
  const [form, setForm] = useState(undefined);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data: config } = await configService.getConfig(guildId);
        setForm({
          enabled: config?.enabled || false,
          ephemeral: config?.ephemeral || false,
          spareMessage: config?.spareMessage || "",
          spareMessageEnabled: config?.spareMessageEnabled || false,
          strikeMessage: config?.strikeMessage || "",
          strikeMessageEnabled: config?.strikeMessageEnabled || false,
        });
      } catch (error) {
        setForm({
          enabled: false,
          ephemeral: false,
          spareMessage: "",
          spareMessageEnabled: false,
          strikeMessage: "",
          strikeMessageEnabled: false,
        });
      }
    };

    const fetchHistory = async () => {
      const { data: history } = await historyService.getHistory(guildId);
      setHistory(history);
      console.log(history);
    };

    fetchConfig();
    fetchHistory();
    setSave(false);
  }, [guildId]);

  function handleChanges(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (save === false) setSave(true);
  }

  async function handleSubmission(e) {
    e.preventDefault();

    try {
      configService.setConfig(guildId, form);
      setSave(false);
      const { data: history } = await historyService.getHistory(guildId);
      setHistory(history);
      showToast({
        severity: ToastSeverity.Success,
        summary: "Config updated",
        detail: "You updated the config successfully.",
        life: 2000,
      });
    } catch (error) {
      const errorDescription = error.response.data.message;
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: errorDescription,
        life: 2000,
      });
    }
  }

  if (isLoading || !form) {
    return (
      <>
        <GuildsSide />
        <div className="flex w-screen ml-8 mt-7">
          <div className="flex w-full">
            <Skeleton shape="circle" size="55px" className="my-auto" />
            <Skeleton
              className="ml-3 my-4"
              shape="rectangle"
              width="250px"
              height="45px"
            />
            <div className="my-auto ml-auto mr-4">
              <Skeleton width="60px" height="30px" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!guild) {
    return (
      <>
        <GuildsSide />
        <NotFoundPage />
      </>
    );
  }

  return (
    <>
      <GuildsSide />
      <form
        onSubmit={handleSubmission}
        className="flex flex-wrap align-items-baseline w-screen ml-8 mt-7"
      >
        <div className="flex w-full">
          <Avatar
            image={guild.icon ? guild.icon : "/images/discord-default.png"}
            shape="circle"
            size="large"
            className="my-auto"
          />
          <h1 className="ml-3">{guild.name}</h1>
          <div className="my-auto ml-auto mr-4">
            <InputSwitch
              name="enabled"
              value={form.enabled}
              checked={form.enabled}
              onChange={handleChanges}
            />
          </div>
        </div>
        <div
          className="border-round-md p-4 mt-2 mr-4"
          style={{ backgroundColor: "var(--gray-800)" }}
        >
          <h4 className="m-0">Configuration</h4>
          <div className="flex flex-wrap">
            <div className="flex flex-column w-1/2">
              <div>
                <div className="flex">
                  <h5>Spare Message</h5>
                  <InputSwitch
                    name="spareMessageEnabled"
                    value={form.spareMessageEnabled}
                    checked={form.spareMessageEnabled}
                    onChange={handleChanges}
                    className="ml-auto my-auto options-switch"
                    disabled={!form.enabled}
                  />
                </div>
                <InputTextarea
                  name="spareMessage"
                  value={form.spareMessage}
                  onChange={handleChanges}
                  cols={40}
                  autoResize
                  disabled={!form.enabled || !form.spareMessageEnabled}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="border-round-md p-4 mt-2 mr-4"
          style={{ backgroundColor: "var(--gray-800)" }}
        >
          <h4 className="m-0">Messages</h4>
          <div className="flex flex-wrap">
            <div className="flex flex-column w-1/2">
              <div>
                <div className="flex">
                  <h5>Ephemeral Messages</h5>
                  <InputSwitch
                    name="ephemeral"
                    value={form.ephemeral}
                    checked={form.ephemeral}
                    onChange={handleChanges}
                    className="ml-auto my-auto options-switch"
                    disabled={!form.enabled}
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <h5>Spare Message</h5>
                  <InputSwitch
                    name="spareMessageEnabled"
                    value={form.spareMessageEnabled}
                    checked={form.spareMessageEnabled}
                    onChange={handleChanges}
                    className="ml-auto my-auto options-switch"
                    disabled={!form.enabled}
                  />
                </div>
                <InputTextarea
                  name="spareMessage"
                  value={form.spareMessage}
                  onChange={handleChanges}
                  cols={40}
                  autoResize
                  disabled={!form.enabled || !form.spareMessageEnabled}
                />
              </div>
              <div>
                <div className="flex">
                  <h5>Strike Message</h5>
                  <InputSwitch
                    name="strikeMessageEnabled"
                    value={form.strikeMessageEnabled}
                    checked={form.strikeMessageEnabled}
                    onChange={handleChanges}
                    className="ml-auto my-auto options-switch"
                    disabled={!form.enabled}
                  />
                </div>
                <InputTextarea
                  name="strikeMessage"
                  value={form.strikeMessage}
                  onChange={handleChanges}
                  cols={40}
                  autoResize
                  disabled={!form.enabled || !form.strikeMessageEnabled}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-8 mb-4">
          <Button
            label="Save"
            type="submit"
            className="ml-auto mr-4"
            disabled={!save}
          />
        </div>
        {history && (
          <div className="flex w-full my-8">
            <h4 className="m-0">History</h4>
            <div className="flex flex-wrap w-full">
              {history.map((h) => (
                <div
                  className="border-round-md p-4 mt-2 mr-4"
                  style={{ backgroundColor: "var(--gray-800)" }}
                >
                  <div className="flex">
                    <h5 className="m-0">{h.actions}</h5>
                    <h5 className="m-0 ml-auto">{h.createdAt}</h5>
                  </div>
                  <div className="flex">
                    <h5 className="m-0">User</h5>
                    <h5 className="m-0 ml-auto">Reason</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default GuildPage;
