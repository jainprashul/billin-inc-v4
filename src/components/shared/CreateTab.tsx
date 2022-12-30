import React, {useMemo} from 'react'
import Tab from '@mui/material/Tab';
import { Box, Tabs } from '@mui/material'
import { a11yProps, TabPanel } from '../../components/shared/TabPanel';


type Props = {
    panels: {
        name: string
        content: () => JSX.Element
        hidden?: boolean,
    }[]

    tabIndex?: number
}

const CreateTab = ({ panels, tabIndex = 0 }: Props) => {
    const Panels = useMemo(() => panels.sort((a, b) => a.hidden ? 1 : -1), [panels])
    const [currentTab, setCurrentTab] = React.useState(tabIndex);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleChangeTab} aria-label="settings tab">
                    {
                        Panels.map((panel, index) => (
                            !panel.hidden && <Tab key={index} label={panel.name} {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
            </Box>

            {
                Panels.map((panel, index) => {
                    const Context = panel.content;
                    return !panel.hidden && (
                        <TabPanel key={index} value={currentTab} tabIndex={index}>
                            <Context />
                        </TabPanel>
                    )
                })
            }</>
    )
}

export default CreateTab