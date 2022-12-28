import { Badge, Grow, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks';
import moment from 'moment';
import React from 'react'
import { useDataUtils } from '../../utils/useDataUtils';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { arrayToPages } from '../../utils';

type Props = {}

const Notifications = (props : Props) => {

    const { companyDB, navigate } = useDataUtils();
    const notifications = useLiveQuery(async () => {
        if (companyDB) {
            const notifications = await companyDB?.notificationlogs.orderBy("date").reverse().toArray()
            return notifications
        }
    }, [companyDB], []) ?? [];

    const {pages , totalPages} = arrayToPages(notifications, 9);
    const [page, setPage] = React.useState(1);
    const currentPage = React.useMemo(() => pages[page - 1] ?? [], [pages, page]);

        return (
        <div className='notifcation-page'>
            <Typography variant="h6">Notifications ({notifications.length})</Typography>
            <List dense>
                {currentPage.map((x) => {
                    return (
                        <Grow in={!!x.id} key={x.id} >
                            <ListItem>
                                <ListItemButton onClick={() => {
                                    if (x.link) {
                                        navigate(x.link)
                                    }
                                }}>
                                    <ListItemAvatar><Badge variant={x.status === 'NEW' ? 'dot' : 'standard'} color="info"  ><NotificationsIcon /> </Badge></ListItemAvatar>
                                    <ListItemText primary={x.message} secondary={`${x.type} - ${moment(x.date).fromNow()}`} />
                                </ListItemButton>
                                {/* <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => x.clear()}>
                                        <Clear />
                                    </IconButton>
                                </ListItemSecondaryAction> */}
                            </ListItem>
                        </Grow>
                    )
                })}
            </List>
            <Pagination count={totalPages} page={page} onChange={(e, page) => setPage(page)} />
        </div>
    )
}

export default Notifications