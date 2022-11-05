import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

import { useToasts } from "../../context/toasts.context";
import { useUser } from "../../context/user.context";
import authService from "../../services/auth.service";
import { ToastSeverity } from "../../utils/enums";

function ProfilePage() {
  const { user, logout } = useUser();
  const { showToast } = useToasts();
  const [dialog, setDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  function handleDialog() {
    setDialog(!dialog);
  }

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
      });
    } catch (error) {
      showToast({
        severity: ToastSeverity.Error,
        summary: "Error",
        detail: "An error occurred while deleting your account.",
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
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "50vw" }}
        >
          <form></form>
        </Dialog>
        <ConfirmDialog
          visible={confirmDialog}
          onHide={() => setConfirmDialog(false)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "50vw" }}
          header="Delete Account"
          message="Are you sure you want to delete your account?"
          icon="pi pi-info-circle"
          acceptClassName="p-button-danger"
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
      </div>
    </>
  );
}

export default ProfilePage;
