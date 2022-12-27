import { ClearAll, NotificationImportant, NotificationsActive } from '@mui/icons-material'
import Clear from '@mui/icons-material/Clear'
import { Card, CardContent, CardHeader, Divider, Grow, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import React from 'react'
import { useDataUtils } from '../../utils/useDataUtils'

type Props = {}

const Notifications = (props: Props) => {
  const { companyDB, navigate } = useDataUtils()

  const notifications = useLiveQuery(async () => {
    if (companyDB) {
      return (await companyDB?.notificationlogs.orderBy("date").filter((x) => x.isVisible).reverse().toArray())
    }
  }, [companyDB], []) ?? [];


  return (
    <div className='notifications'>
      <Card className='minHeight-300' style={{
        height: '100%',
        maxHeight: '460px',
        overflow: 'auto'
      }} >
        <ListSubheader>
        <CardHeader avatar={<NotificationImportant />} title="Notifications" subheader={`${notifications.length} unread notifications`} action={
          <IconButton edge="end" aria-label="delete" onClick={() => {
            notifications.forEach((x) => x.clear())
          }}>
            <ClearAll />
          </IconButton>
        }/>
        </ListSubheader>
        <Divider />

        <CardContent>
          <List dense>
            {notifications.map((x) => {
              return (
                <Grow in={!!x.id} key={x.id} >
                <ListItem >
                  <ListItemButton onClick={()=> {
                    if (x.link) {
                      navigate(x.link)
                    }
                  }}>
                  <ListItemAvatar><NotificationsActive /></ListItemAvatar>
                  <ListItemText primary={x.message} secondary={`${x.type} - ${moment(x.date).fromNow()}`} />
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => x.clear()}>
                      <Clear />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                </Grow>
              )
            })}
          </List>
        </CardContent>

      </Card>

    </div>

  )
}

export default Notifications