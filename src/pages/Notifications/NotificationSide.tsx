import ClearAll from '@mui/icons-material/ClearAll'
import Notifications from '@mui/icons-material/Notifications'
import NotificationImportant from '@mui/icons-material/NotificationImportant'
import Clear from '@mui/icons-material/Clear'
import { Badge, Card, CardContent, CardHeader, Divider, Grow, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import React from 'react'
import { NotificationLog } from '../../services/database/model'
import { useDataUtils } from '../../utils/useDataUtils'
import { NOTIFICATIONS } from '../../constants/routes'

type Props = {
  getNotificationCount?: (notifications: NotificationLog[]) => number
}

const NotificationSide = (props: Props) => {
  const { companyDB, navigate } = useDataUtils()

  const notifications = useLiveQuery(async () => {
    if (companyDB) {
      const notifications = await companyDB?.notificationlogs.orderBy("date").filter((x) => x.isVisible).reverse().toArray()
      props.getNotificationCount?.(notifications)
      return notifications
    }
  }, [companyDB], []) ?? [];


  return (
    <div className='notifications'>
      <Card className='minHeight-300' style={{
        height: '100%',
        maxHeight: '36rem',
        overflow: 'auto'
      }} >
        <ListSubheader>
          <CardHeader avatar={<NotificationImportant />}
            title={<span style={{
              fontWeight: 'bold',
              fontStyle: 'italic',
              cursor: 'pointer'
            }} onClick={() => { navigate(NOTIFICATIONS) }}>
              Notifications ({notifications.length})
            </span>}
            subheader={`${notifications.filter(n => n.status === 'NEW').length} unread notifications`} action={
              <IconButton edge="end" aria-label="delete" onClick={() => {
                notifications.forEach((x) => x.clear())
              }}>
                <ClearAll />
              </IconButton>
            } />
          <Divider />
        </ListSubheader>

        <CardContent>
          <List dense>
            {notifications.map((x) => {
              return (
                <Grow in={!!x.id} key={x.id} >
                  <ListItem onMouseEnter={() => {
                    if (x.status === 'NEW') {
                      x.markAsRead()
                    }
                  }}>
                    <ListItemButton onClick={() => {
                      if (x.link) {
                        navigate(x.link)
                      }
                    }}>
                      <ListItemAvatar><Badge variant={x.status === 'NEW' ? 'dot' : 'standard'} color="info"  ><Notifications /> </Badge></ListItemAvatar>
                      <ListItemText primary={x.message} secondary={<>
                        <span style={{ fontWeight: 'bold' }}>{x.type}</span> - {moment(x.date).fromNow()}
                        {x.createdBy && <span> by {x.createdBy}</span>}
                      </>} />
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

export default NotificationSide