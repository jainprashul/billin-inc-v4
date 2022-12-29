import { Badge, Grow, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks';
import moment from 'moment';
import React from 'react'
import { useDataUtils } from '../../utils/useDataUtils';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { arrayToPages } from '../../utils';
import Filters, { Filter as FilterItem } from '../../components/shared/Filters';
import { NotificationType } from '../../services/database/model/NotificationLog';
import db from '../../services/database/db';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOff from '@mui/icons-material/FilterListOff';

let timeOut = 150;
const _filter = {
    date: {
        from: moment().startOf('day').toDate(),
        to: moment().endOf('day').toDate()
    },
    status: 'ALL',
    type: 'ALL',
    user: ['ALL']
}
type Props = {}

const Notifications = (props: Props) => {

    // TODO : Add Filter by date , by status , by type , by user, 

    const [filter, setFilter] = React.useState(_filter);
    const [showFilter, setShowFilter] = React.useState(false);



    const { companyDB, navigate } = useDataUtils();
    const notifications = useLiveQuery(async () => {
        if (companyDB) {
            const notifications = await companyDB?.notificationlogs.orderBy("date").filter((x) => {
                return x.date >= filter.date.from && x.date <= filter.date.to &&
                    (filter.status === "ALL" || x.status === filter.status) &&
                    (filter.type === "ALL" || x.type === filter.type) &&
                    (filter.user.includes("ALL") || filter.user.includes(x.createdBy))
            })
                .reverse().toArray()
            return notifications
        }
    }, [companyDB, filter], []) ?? [];

    const users = useLiveQuery(async () => {
        return db.users.toArray()
    }, []) ?? [];

    const { pages, totalPages } = arrayToPages(notifications, 8);
    const [page, setPage] = React.useState(1);
    const currentPage = React.useMemo(() => pages[page - 1] ?? [], [pages, page]);

    const filterList: FilterItem[] = [
        {
            name: 'date',
            component: 'date',
            value: filter.date
        },
        {
            name: 'status',
            component: 'select',
            value: filter.status,
            options: ['ALL', 'NEW', 'SEEN']
        },
        {
            name: 'type',
            component: 'select',
            value: filter.type,
            options: ['ALL', ...Object.values(NotificationType)]
        },
        {
            name: 'user',
            component: 'checkbox',
            value: filter.user,
            options: ['ALL', ...users.map(x => x.name)]
        }
    ]

    return (
        <div className='notifcation-page'>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Typography variant="h6">Notifications ({notifications.length})</Typography>
                <div style={{
                    display: 'flex',
                }}>
                {showFilter && <Filters filters={filterList}  getFilters={(xFilter) => setFilter({
                    ...filter,
                    ...xFilter
                })} />}
                <IconButton>{
                    showFilter ? <FilterListOff onClick={() => setShowFilter(false)} /> : <FilterListIcon onClick={() => setShowFilter(true)} />
                }</IconButton>
</div>
            </div>
            

            <List dense>
                {currentPage.map((x, i) => {
                    return (
                        <Grow in={!!x.id} key={x.id} timeout={timeOut * i} >
                            <ListItem>
                                <ListItemButton onClick={() => {
                                    if (x.link) {
                                        navigate(x.link)
                                    }
                                }}>
                                    <ListItemAvatar><Badge variant={x.status === 'NEW' ? 'dot' : 'standard'} color="info"  ><NotificationsIcon /> </Badge></ListItemAvatar>
                                    <ListItemText primary={x.message}
                                        secondary={<>
                                            <span style={{ fontWeight: 'bold' }}>{x.type}</span> - {moment(x.date).fromNow()}
                                            {x.createdBy && <span> by {x.createdBy}</span>}
                                        </>} />
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