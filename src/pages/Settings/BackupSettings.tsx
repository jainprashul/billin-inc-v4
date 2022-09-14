import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { clearALLCache, deleteData, exportData, importData } from '../../utils/dbUtils'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AlertDialog from '../../components/shared/AlertDialog';

type Props = {}

const BackupSettings = (props: Props) => {

  const toast = useSnackbar();
  const [dialog, setDialog] = React.useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => { }

  });


  const importFile = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      importData(file).then(() => {
        toast.enqueueSnackbar("Data imported successfully", { variant: "success" });
        // prompt user to reload the app
        setDialog({
          open: true,
          title: "Reload",
          message: "Data imported successfully. Reload the app to see the changes",
          onConfirm: () => {
            window.location.reload();
          }
        })
      }).catch((err) => {
        toast.enqueueSnackbar("Error while importing data", { variant: "error" });
      })
    } else {
      toast.enqueueSnackbar("No file selected", { variant: "error" })
    }
  }

  const exportDataHandler = () => {
    exportData().then(() => {
      toast.enqueueSnackbar("Data exported successfully", { variant: "success" });
    }).catch((err) => {
      toast.enqueueSnackbar("Error while exporting data", { variant: "error" });
    })
  }

  const deleteDataHandler = () => {
    setDialog({
      open: true,
      title: "Delete Data",
      message: "Are you sure you want to delete all data? This action cannot be undone.",
      onConfirm: () => {
        deleteData().then(() => {
          toast.enqueueSnackbar("Data deleted successfully", { variant: "success" });
          // prompt user to reload the app
          setDialog({
            open: true,
            title: "Reload",
            message: "Data deleted successfully. Reload the app to see the changes",
            onConfirm: () => {
              window.location.reload();
            }
          })
        }).catch((err) => {
          toast.enqueueSnackbar("Error while deleting data", { variant: "error" });
        })
      }
    })
  }

  const clearAllAppData = () => {
    clearALLCache().then((boo) => {
      if (boo) {
        toast.enqueueSnackbar("App data cleared successfully", { variant: "success" });
        // prompt user to reload the app
        setDialog({
          open: true,
          title: "Reload",
          message: "App data cleared successfully. Reload the app to see the changes",
          onConfirm: () => {
            window.location.reload();
          }
        })
      } else {
        toast.enqueueSnackbar("No internet connection, make sure to connect to the internet before clearing cache", { variant: "error" });
      }
    }).catch((err) => {
      toast.enqueueSnackbar("Error while clearing app data", { variant: "error" });
    })
  }


  return (
    <div>
      <Button startIcon={<DownloadForOfflineIcon />} onClick={exportDataHandler}>Backup Data</Button>
      {/* <Button>Backup via Excel</Button> */}
      <br />

      <input id='rfile' hidden={true} type='file' accept='.dbx' onInput={importFile} />
      <label htmlFor="rfile">
        <Button startIcon={<RestoreIcon />} component="span">
          Restore Data
        </Button>
      </label>

      {/* <Button>Restore via Excel</Button> */}
      <br />

      <Button startIcon={<DeleteForeverIcon />} onClick={deleteDataHandler}>Delete  Data</Button>
      <br />

      {/* TODO : Online BackUp */}
      <Button startIcon={<CloudUploadIcon />}>Online Backup</Button>
      <br />
      <Button startIcon={<CloudDownloadIcon />}>Online Restore</Button>
      <br />

      <Button onClick={clearAllAppData} startIcon={<ClearAllIcon />}> Clear Application Cache</Button>

      {/* Dialogs  */}
      <AlertDialog
        open={dialog.open}
        setOpen={(open) => setDialog({ ...dialog, open })}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.title !== "Reload"}
        backdropClose={dialog.title !== "Reload"}
      />

    </div>
  )
}

export default BackupSettings