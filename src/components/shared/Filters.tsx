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
    default?: any
}


export const DateTimeFilters = [
    {
        name: 'today',
        label: 'Today',
        value : {
            from : moment().startOf('day').toDate(),
            to : moment().endOf('day').toDate()
        }
    },
    {
        name: 'yesterday',
        label: 'Yesterday',
        value : {
            from : moment().subtract(1, 'days').startOf('day').toDate(),
            to : moment().subtract(1, 'days').endOf('day').toDate()
        }
    },
    {
        name: 'thisWeek',
        label: 'This Week',
        value : {
            from : moment().startOf('week').toDate(),
            to : moment().endOf('week').toDate()
        }
    }, 
    {
        name: 'lastWeek',
        label: 'Last Week',
        value : {
            from : moment().subtract(1, 'weeks').startOf('week').toDate(),
            to : moment().subtract(1, 'weeks').endOf('week').toDate()
        }
    },
    {
        name: 'thisMonth',
        label: 'This Month',
        value : {
            from : moment().startOf('month').toDate(),
            to : moment().endOf('month').toDate()
        }
    }, {
        name: 'lastMonth',
        label: 'Last Month',
        value : {
            from : moment().subtract(1, 'months').startOf('month').toDate(),
            to : moment().subtract(1, 'months').endOf('month').toDate()
        },
    }, {
        name: 'thisQuarter',
        label: 'This Quarter',
        value : {
            from : moment().startOf('quarter').toDate(),
            to : moment().endOf('quarter').toDate()
        }
    }, {
        name: 'lastQuarter',
        label: 'Last Quarter',
        value : {
            from : moment().subtract(1, 'quarters').startOf('quarter').toDate(),
            to : moment().subtract(1, 'quarters').endOf('quarter').toDate()
        }
    },
    {
        name: 'thisYear',
        label: 'This Year',
        value : {
            from : moment().startOf('year').toDate(),
            to : moment().endOf('year').toDate()
        }
    }, {
        name: 'lastYear',
        label: 'Last Year',
        value : {
            from : moment().subtract(1, 'years').startOf('year').toDate(),
            to : moment().subtract(1, 'years').endOf('year').toDate()
        }
    }
]

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
            {Object.keys(filterState).length && filters.map((x, i) => {
                if (x.component === 'select') {
                    return (
                        <SelectFilter key={i} filters={filterState} setFilters={setFilterState} filterName={x.name} options={x.options} />
                    )
                }
                if (x.component === 'checkbox') {
                    return (
                        <CheckboxFilter key={i} filters={filterState} setFilters={setFilterState} filterName={x.name} options={x.options} />
                    )
                }
                if (x.component === 'date') {
                    return (
                        <DateFilter key={i} filters={filterState} setFilters={setFilterState} filterName={x.name} defaultVal={x.default} />
                    )
                }
                return null
            })}

        </Stack>
    )
}

type SelectFilterProps = { filters: any, setFilters: (filters: any) => void, filterName: string, options?: any[], defaultVal?: any }
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
const DateFilter = ({ filters, setFilters, filterName , defaultVal='thisWeek'  } : SelectFilterProps) => {
    const [custom, setCustom] = React.useState(false)
    const [customDate, setCustomDate] = React.useState(DateTimeFilters.find((x) => x.name === defaultVal)?.value ?? {
        from: moment().startOf('week').toDate(),
        to: moment().endOf('week').toDate()
    })

    React.useEffect(() => {
        setFilters({
            ...filters,
            [filterName]: customDate
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customDate])

    const handleTimeChange = (val: string) => {
        return DateTimeFilters.find((x) => x.name === val)?.value ?? {
            from: moment().startOf('week').toDate(),
            to: moment().endOf('week').toDate()
        }
    }

    return (
        <FormControl>
            <InputLabel id="demo-multiple-checkbox-label" style={{
                textTransform: 'capitalize',
            }}>{filterName}</InputLabel>
            <Select
                input={<OutlinedInput label={filterName} />}
                defaultValue={defaultVal}
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
                {
                    DateTimeFilters.map((x, i) => {
                        return (
                            <MenuItem key={i} value={x.name}>{x.label}</MenuItem>
                        )
                    })
                }
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