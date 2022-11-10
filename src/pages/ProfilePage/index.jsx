import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

import { useToasts } from "../../context/toasts.context";
import { useUser } from "../../context/user.context";
import authService from "../../services/auth.service";
import { ToastLife, ToastSeverity } from "../../utils/enums";

function ProfilePage() {
  const { user, authenticate, logout } = useUser();
  const { showToast } = useToasts();

  const [form, setForm] = useState({
    email: user.email,
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [dialog, setDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

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

  function handleDialog() {
    setDialog(!dialog);
  }

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      const { data } = await authService.editAccount(form);
      authenticate({ user: data.user, token: localStorage.getItem("token") });
      handleDialog();
      setForm({
        email: data.user.email,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast({
        severity: ToastSeverity.Success,
        summary: "Account updated",
        detail: "Account updated successfully.",
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
  };
  function handleConfirmDialog() {
    setConfirmDialog(!confirmDialog);
  }

  async function handleDelete() {
    try {
      await authService.deleteAccount();
      logout();
      showToast({
        severity: ToastSeverity.Success,
        summary: "Account deleted",
        detail: "Your account has been deleted successfully.",
        life: ToastLife.Success,
      });
    } catch (error) {
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: "An error occurred while deleting your account.",
        life: ToastLife.Error,
      });
    }
  }

  return (
    <>
      <div className="flex flex-column mx-8 mt-7 w-full">
        <div className="flex w-full">
          <h1>Profile</h1>
          <div className="ml-auto my-auto">
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-text mr-2"
              aria-label="Edit Profile"
              onClick={handleDialog}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-text p-button-danger mr-2"
              aria-label="Delete Account"
              onClick={handleConfirmDialog}
            />
          </div>
        </div>
        <Dialog
          header="Edit Profile"
          visible={dialog}
          onHide={handleDialog}
          breakpoints={{ "960px": "45vw" }}
          style={{ width: "20vw" }}
        >
          <div className="flex flex-column align-items-center w-full">
            <form onSubmit={handleSubmission}>
              <div className="mb-3">
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
                  <h4 className="m-0">Current Password</h4>
                  <Password
                    name="password"
                    value={form.password}
                    onChange={handleChanges}
                    toggleMask
                    feedback={false}
                  />
                </label>
              </div>

              <div className="my-3">
                <label>
                  <h4 className="m-0">New Password</h4>
                  <Password
                    name="newPassword"
                    value={form.newPassword}
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
              <Button label="Edit" className="p-button-sm" />
            </form>
          </div>
        </Dialog>
        <ConfirmDialog
          visible={confirmDialog}
          onHide={() => setConfirmDialog(false)}
          breakpoints={{ "960px": "55vw", "640px": "80vw" }}
          style={{ width: "30vw" }}
          header="Delete Account"
          message="Are you sure you want to delete your account?"
          icon="pi pi-info-circle"
          acceptClassName="p-button-danger p-button-text"
          acceptIcon="pi pi-trash"
          rejectClassName="p-button"
          rejectIcon="pi pi-times"
          accept={handleDelete}
          reject={handleConfirmDialog}
        />
        <div className="flex w-full">
          <Avatar
            image={
              user?.discord?.avatar
                ? user.discord.avatar
                : "/images/discord-default.png"
            }
            shape="circle"
            size="large"
            className="my-auto"
          />
          <p className="ml-3">
            {user?.discord?.username ? user.discord.username : user.email}
          </p>
        </div>
        <p>Email: {user.email}</p>
        {user.discord && (
          <p>
            Discord:{" "}
            {`${user.discord.username}#${user.discord.discriminator} (${user.discord.id})`}
          </p>
        )}
        <div>
          <Button className="discord p-0" aria-label="Discord">
            <i className="pi pi-discord px-2"></i>
            <span className="px-3">Discord</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
