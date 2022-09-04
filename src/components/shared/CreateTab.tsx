import React from 'react'
import Tab from '@mui/material/Tab';
import { Box, Tabs } from '@mui/material'
import { a11yProps, TabPanel } from '../../components/shared/TabPanel';


type Props = {
    panels: {
        name: string
        content: () => JSX.Element
    }[]
}

const CreateTab = ({ panels }: Props) => {
    const [currentTab, setCurrentTab] = React.useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleChangeTab} aria-label="settings tab">
                    {
                        panels.map((panel, index) => (
                            <Tab key={index} label={panel.name} {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
            </Box>

            {
                panels.map((panel, index) => {
                    const Context = panel.content;
                    return (
                        <TabPanel key={index} value={currentTab} tabIndex={index}>
                            <Context />
                        </TabPanel>
                    )
                })
            }</>
    )
}

export default CreateTab