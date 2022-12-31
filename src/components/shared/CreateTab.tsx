import React, {useMemo} from 'react'
import Tab from '@mui/material/Tab';
import { Box, Tabs } from '@mui/material'
import { a11yProps, TabPanel } from '../../components/shared/TabPanel';

export interface Panel {
    name: string
    content: () => JSX.Element
    hidden?: boolean,
}

type Props = {
    panels: Panel[]
    children?: React.ReactNode
    tabIndex?: number
}

const CreateTab = ({ panels, tabIndex = 0, children }: Props) => {
    const Panels = useMemo(() => panels.sort((a, b) => a.hidden ? 1 : -1), [panels])
    const [currentTab, setCurrentTab] = React.useState(tabIndex);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    return (
        <>
            <Box borderBottom={1} borderColor={'divider'} display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
                <div>
                <Tabs value={currentTab} onChange={handleChangeTab} aria-label="settings tab">
                    {
                        Panels.map((panel, index) => (
                            !panel.hidden && <Tab key={index} label={panel.name} {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
                </div>
                {children}
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