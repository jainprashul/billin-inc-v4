import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React from 'react'
import DateProvider from './DateProvider'

export type Filter = {
    name: string,
    value: any
    component: 'select' | 'date' | 'checkbox' | 'text'
    options?: any[]
}

type Props = {
    filters: Filter[],
    getFilters: (filters: any) => void
}

const Filters = ({ filters, getFilters }: Props) => {

    const [filterState, setFilterState] = React.useState<any>({})

    React.useEffect(() => {
        const state: { [key: string]: any } = {}
        filters.forEach((x) => {
            state[x.name] = x.value
        })


        setFilterState(state)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        getFilters(filterState)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterState])

    return (
        <Stack direction="row" spacing={2} m={1}>
            {Object.keys(filterState).length && filters.map((x) => {
                if (x.component === 'select') {
                    return (
                        <SelectFilter filters={filterState} setFilters={setFilterState} filterName={x.name} options={x.options} />
                    )
                }
                if (x.component === 'checkbox') {
                    return (
                        <CheckboxFilter filters={filterState} setFilters={setFilterState} filterName={x.name} options={x.options} />
                    )
                }
                if (x.component === 'date') {
                    return (
                        <DateFilter filters={filterState} setFilters={setFilterState} filterName={x.name} />
                    )
                }
                return null
            })}

        </Stack>
    )
}

type SelectFilterProps = { filters: any, setFilters: (filters: any) => void, filterName: string, options?: any[] }
// create a select component with the filters
const SelectFilter = ({ filters, setFilters, filterName, options = [] }: SelectFilterProps) => {
    return (
        <FormControl>
            <InputLabel id="demo-multiple-checkbox-label" style={{
                textTransform: 'capitalize',
            }}>{filterName}</InputLabel>
            <Select
                input={<OutlinedInput label={filterName} />}
                value={filters[filterName]}
                onChange={(e) => {
                    setFilters({
                        ...filters,
                        [filterName]: e.target.value
                    })
                }}
            >
                {options.map((x: any) => {
                    return (
                        <MenuItem value={x}>{x}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

// CREATE the checkbox component with the filters
const CheckboxFilter = ({ filters, setFilters, filterName, options = [] }: SelectFilterProps) => {
    return (
        <FormControl>
            <InputLabel id="demo-multiple-checkbox-label" style={{
                textTransform: 'capitalize',
            }}>{filterName}</InputLabel>
            <Select
                multiple
                input={<OutlinedInput label={filterName} />}
                value={filters[filterName]}
                onChange={(e) => {
                    setFilters({
                        ...filters,
                        [filterName]: e.target.value
                    })
                }}
                renderValue={(selected) => (selected as string[]).join(', ')}
            >
                {options.map((x: any) => {
                    return (
                        <MenuItem value={x}>
                            <Checkbox checked={filters[filterName].indexOf(x) > -1} />
                            <ListItemText primary={x} />
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

// create a date component with the filters
const DateFilter = ({ filters, setFilters, filterName }: SelectFilterProps) => {
    const [custom, setCustom] = React.useState(false)
    const [customDate, setCustomDate] = React.useState({
        from: moment().startOf('day').toDate(),
        to: moment().endOf('day').toDate()
    })

    React.useEffect(() => {
        setFilters({
            ...filters,
            [filterName]: customDate
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customDate])

    const handleTimeChange = (val: string) => {
        switch (val) {
            case 'today':
                return {
                    from: moment().startOf('day').toDate(),
                    to: moment().endOf('day').toDate()
                }

            case 'yesterday':
                return {
                    from: moment().subtract(1, 'days').startOf('day').toDate(),
                    to: moment().subtract(1, 'days').endOf('day').toDate()
                }
            case 'thisWeek':
                return {
                    from: moment().startOf('week').toDate(),
                    to: moment().endOf('week').toDate()
                }
            case 'thisMonth':
                return {
                    from: moment().startOf('month').toDate(),
                    to: moment().endOf('month').toDate()
                }
            case 'thisYear':
                return {
                    from: moment().startOf('year').toDate(),
                    to: moment().endOf('year').toDate()
                }
            default:
                return {
                    from: moment().startOf('years').toDate(),
                    to: moment().endOf('years').toDate()
                }
        }
    }

    

    return (
        <FormControl>
            <InputLabel id="demo-multiple-checkbox-label" style={{
                textTransform: 'capitalize',
            }}>{filterName}</InputLabel>
            <Select
                input={<OutlinedInput label={filterName} />}
                defaultValue="today"
                onChange={(e) => {
                    let val = handleTimeChange(e.target.value)
                    if (e.target.value === 'custom') {
                        setCustom(true)
                        return
                    } else {
                        setCustom(false)
                    }

                    setFilters({
                        ...filters,
                        [filterName]: val
                    })
                }}
            >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
                <MenuItem  value="custom">Custom</MenuItem>
            </Select>

            {custom && <>
            
            <div style={{
                margin: 10,
            }}>
                
            <DateProvider>
                <DatePicker
                    label="From"
                    value={customDate.from}
                    onChange={(newValue) => {
                        setCustomDate({
                            ...customDate,
                            from: newValue ?? moment().startOf('day').toDate()
                        })
                    }}
                    
                    renderInput={(params) => <TextField  {...params} />}
                />
                </DateProvider>
                <DateProvider>
                <DatePicker
                    label="To"
                    value={customDate.to}
                    onChange={(newValue) => {
                        setCustomDate({
                            ...customDate,
                            to: newValue ?? moment().endOf('day').toDate()
                        })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </DateProvider>
            </div>
            
            </>}
        </FormControl>
    )
}
export default Filters