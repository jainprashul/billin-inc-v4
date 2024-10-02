import MaterialTable, { Action, Column } from '@material-table/core'
import React from 'react'
import { User } from '../../../services/database/model'
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AlertDialog from '../../../components/shared/AlertDialog';
import { useDataUtils } from '../../../utils/useDataUtils';
import { UserEdit } from '.';

type Props = {
  data: Array<User>
}


const UserTable = ({ data }: Props) => {
  const {toast} = useDataUtils()
  const [edit, setEdit] = React.useState({
    open: false,
    user: undefined as User | undefined
  })

  const [dialog, setDialog] = React.useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => { }
  });

  const deleteUser = async (user: User) => {
    await new User(user).delete();
  }

  const columns: Array<Column<User>> = [
    {
      title: 'Name',
      field: 'name',
    }, {
      title: 'Email',
      field: 'email',
    }, {
      title: 'Username',
      field: 'username',
    }, {
      title: 'Role',
      field: 'role.name',
    },
  ]

  const actions: Array<Action<User>> = [
    {
      icon: () => <EditIcon />,
      tooltip: 'Edit User',
      onClick: (event, rowData) => {
        const user = rowData as User
        setEdit({
          open: true,
          user
        })
        console.log('edit', rowData)
      }
    }, {
      icon: () => <PersonRemoveIcon />,
      tooltip: 'Delete User',
      onClick: (event, rowData) => {
        const user = rowData as User

        setDialog({
          open: true,
          title: "Delete User",
          message: `Are you sure you want to delete user ${user.name} ?`,
          onConfirm: async () => {
            // delete user
            await deleteUser(user)
            toast.enqueueSnackbar(`User ${user.name} deleted`, { variant: 'success' })
          }
        })
      }
    }
  ]

  return (
    <>
      <MaterialTable
        columns={columns}
        data={data}
        actions={actions}
        options={{
          actionsColumnIndex: -1,
          pageSize: 5,
          pageSizeOptions: [5, 10, 20, 30, 50],
          draggable: true,
          headerStyle: {
            fontWeight: 'bold',
          },
        }}
        title="Users"

      />
      {/* Dialogs  */}
      <AlertDialog
        open={dialog.open}
        setOpen={(open) => setDialog({ ...dialog, open })}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        backdropClose={false}
      />

      {edit.open && <UserEdit open={edit.open} setOpen={(open) => setEdit({...edit , open})} user={edit.user!} />}
    </>
  )
}

export default UserTable