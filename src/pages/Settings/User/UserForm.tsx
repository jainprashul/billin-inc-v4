import { Alert, Button, Grid, MenuItem, Select, TextField } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useFormik } from 'formik'
import React from 'react'
import db from '../../../services/database/db'
import { User, UserRoles } from '../../../services/database/model'

type Props = {
  user?: User,
  onSubmit: (values: User) => void
}

const UserForm = ({ onSubmit, user = new User({
  name: "",
  email: "",
  username: "",
  password: "",
}) }: Props) => {

  const companys = useLiveQuery(() => db.companies.toArray()) ?? []

  const submitHandler = (user: User) => {
    onSubmit(user)
  }

  const formik = useFormik({
    initialValues: user,
    onSubmit: (values, helper) => {submitHandler(values); console.log(helper)},
    validationSchema: User.validationSchema,
    validateOnChange: false,
  })


  const { name, email, username, password, companyIDs, roleID } = formik.values;

  return (
    <form id="user-form" onSubmit={formik.handleSubmit}>
      {Object.keys(formik.errors).length ? <Alert severity="error" >
        {JSON.stringify(formik.errors)}
      </Alert> : <></>}

      <Grid container spacing={2}>
        <Grid item xs={9} md={9}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            error={formik.errors.name ? true : false}
            helperText={formik.errors.name}
            value={name}
            onChange={
              e => {
                formik.setFieldValue('name', e.target.value);
              }
            }
          />
        </Grid>
        <Grid item xs={9} md={9}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
            error={formik.errors.username ? true : false}
            helperText={formik.errors.username}
            value={username}
            onChange={
              e => {
                formik.setFieldValue('username', e.target.value);
              }
            }
          />
        </Grid>
        <Grid item xs={9} md={9}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            type={'email'}
            value={email}
            error={formik.errors.email ? true : false}
            helperText={formik.errors.email}
            onChange={
              e => {
                formik.setFieldValue('email', e.target.value);
              }
            }
          />
        </Grid>
        <Grid item xs={9} md={9}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            type={'password'}
            value={password}
            error={formik.errors.password ? true : false}
            helperText={formik.errors.password}
            onChange={
              e => {
                formik.setFieldValue('password', e.target.value);
              }
            }
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <Select variant='standard'
            margin="dense"
            required
            fullWidth
            id="roleID"
            label="Role"
            name="roleID"
            value={roleID}
            onChange={ e => {
              formik.setFieldValue('roleID', e.target.value);
            }}
          >
            {UserRoles.map((role) => (
              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6} md={6}>
          <Select variant='standard'
            margin="dense"
            required
            fullWidth
            id="companyIDs"
            label="Company"
            name="companyIDs"
            value={companyIDs}
            multiple
            onChange={ e => {
              formik.setFieldValue('companyIDs', e.target.value);
            }}
          >
            { companys.map((company) => ( <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem> )) }
          </Select>
        </Grid>
      </Grid>
      <br />
      

      <div className="client-footer" >
                <Button style={{
                    marginRight: '10px'
                }} type="reset" onClick={() => formik.resetForm()} variant="contained" color="primary">
                    Clear
                </Button>
                <Button type="submit" variant="contained" color="primary" >
                    Save
                </Button>
            </div>

    </form>
  )
}

export default UserForm