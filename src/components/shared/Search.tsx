import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';



type Props = {
    query?: string;
    onSearch: (query: string) => void;
    onClear?: () => void;
}

const Search = ({ query, onClear, onSearch }: Props) => {
    const [searchQuery, setSearchQuery] = useState(query || '');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onSearch(e.target.value.trim());
    };
    const debouncedRes = useMemo(() => debounce(handleSearch, 300), []);
    return (
        <div className="search">
            <TextField
                inputProps={{ "data-testid": "req-search" }}
                id="search-input"
                label="Search"
                value={searchQuery}
                margin='normal'
                onChange={e => {
                    setSearchQuery(e.target.value);
                    debouncedRes(e)
                }}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchQuery.length ? (
                        <InputAdornment position="end">
                            <ClearIcon style={{
                                cursor: 'pointer'
                            }} onClick={() => {
                                setSearchQuery('');
                                onClear && onClear();
                            }} />
                        </InputAdornment>
                    ) : null,
                }}
                variant="standard"
            />
        </div>
    )
}

export default Search