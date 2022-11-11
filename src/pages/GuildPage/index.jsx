import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Skeleton } from "primereact/skeleton";
import { React, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import GuildsSide from "../../components/GuildsSide";
import { useGuilds } from "../../context/guilds.context";
import { useToasts } from "../../context/toasts.context";
import configService from "../../services/config.service";
import { fetchGuildData } from "../../utils";
import { ToastLife, ToastSeverity } from "../../utils/enums";

function GuildPage() {
  const { guildId } = useParams();
  const { isLoading, getGuild } = useGuilds();
  const { showToast } = useToasts();
  const navigate = useNavigate();

  const guild = getGuild(guildId);

  const [isLoadingData, setIsLoadingData] = useState(false);

  const [guildData, setGuildData] = useState(guild);
  const [history, setHistory] = useState(undefined);
  const [form, setForm] = useState(undefined);
  const [save, setSave] = useState(false);

  const fetchGuild = useCallback(async () => {
    setIsLoadingData(true);
    const data = await fetchGuildData(guildId, guild);
    setGuildData(data);
    setIsLoadingData(false);
  }, [guild, guildId]);

  const fetchConfig = useCallback(async () => {
    const { data: config } = await configService.getConfig(guildId);
    setForm({
      enabled: config?.enabled || false,
      ephemeral: config?.ephemeral || false,
      allowedChannels: config?.allowedChannels || [],
      allowedRoles: config?.allowedRoles || [],
      adminChannel: config?.adminChannel || "",
      spareMessage: config?.spareMessage || "",
      spareMessageEnabled: config?.spareMessageEnabled || false,
      strikeMessage: config?.strikeMessage || "",
      strikeMessageEnabled: config?.strikeMessageEnabled || false,
    });
  }, [guildId]);

  const fetchHistory = useCallback(async () => {
    const { data: history } = await configService.getHistory(guildId);
    setHistory(history);
  }, [guildId]);

  useEffect(() => {
    fetchGuild();
    fetchConfig();
    fetchHistory();
    setSave(false);
  }, [fetchConfig, fetchGuild, fetchHistory, guild, navigate]);

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
      /* const { data: history } = await configService.getHistory(guildId);
      setHistory(history); */
      fetchHistory();
      showToast({
        severity: ToastSeverity.Success,
        summary: "Config updated",
        detail: "You updated the config successfully.",
        life: ToastLife.Success,
      });
    } catch (error) {
      const errorDescription = error.response.data.message;
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: errorDescription,
        life: ToastLife.Error,
      });
    }
  }

  if (isLoading || !form || isLoadingData) {
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

  if (!isLoading && !isLoadingData && !guildData && !guild)
    navigate("/dashboard", { replace: true });

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

        {/* Messages Div */}
        <div
          className="border-round-md p-4 mt-2 mr-4"
          style={{ backgroundColor: "var(--gray-800)" }}
        >
          <h4 className="m-0">Messages</h4>
          <div className="flex flex-wrap">
            <div className="flex flex-column w-1/2">
              <div>
                <div className="flex">
                  <h5>Private Messages</h5>
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
                  <h5>Custom Spare Message</h5>
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
                  <h5>Custom Strike Message</h5>
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

        {/* Channels Div */}
        <div
          className="border-round-md p-4 mt-2 mr-4"
          style={{ backgroundColor: "var(--gray-800)" }}
        >
          <h4 className="m-0">Channels</h4>
          <div className="flex flex-wrap">
            <div className="flex flex-column w-1/2">
              <div>
                <h5>Playable Channels</h5>
                <MultiSelect
                  name="allowedChannels"
                  value={form.allowedChannels}
                  onChange={handleChanges}
                  options={guildData?.channels}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Channels"
                  filter
                  disabled={!form.enabled}
                />
              </div>
              <div>
                <h5>Admin Channel</h5>
                <Dropdown
                  name="adminChannel"
                  value={form.adminChannel}
                  onChange={handleChanges}
                  options={guildData?.channels}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Channel"
                  filter
                  disabled={!form.enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Roles Div */}

        <div
          className="border-round-md p-4 mt-2 mr-4"
          style={{ backgroundColor: "var(--gray-800)" }}
        >
          <h4 className="m-0">Roles</h4>
          <div className="flex flex-wrap">
            <div className="flex flex-column w-1/2">
              <div>
                <h5>Allowed Roles</h5>
                <MultiSelect
                  name="allowedRoles"
                  value={form.allowedRoles}
                  onChange={handleChanges}
                  options={guildData?.roles}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Roles"
                  filter
                  disabled={!form.enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button Div */}

        <div className="flex w-full mt-8 mb-4">
          <Button
            label="Save"
            type="submit"
            className="ml-auto mr-4"
            disabled={!save}
          />
        </div>

        {/* History Div */}
        {history && (
          <div className="my-8 ml-4">
            <h3 className="m-0">History</h3>
            <DataTable
              value={history}
              responsiveLayout="scroll"
              className="mt-4"
            >
              <Column field="createdAt" header="Date"></Column>
              <Column field="actions" header="Actions"></Column>
              <Column field="username" header="User"></Column>
            </DataTable>
          </div>
        )}
      </form>
    </>
  );
}

export default GuildPage;
