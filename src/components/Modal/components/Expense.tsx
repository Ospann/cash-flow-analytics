import { useState } from 'react';
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import classes from '../Modal.module.css';
import IExpense from '../interfaces/IExpense';
import { useSelector } from "react-redux";
import { RootState } from "@store/reducer";
import { useDispatch } from "react-redux";
import { addTransaction } from "@store/action";
import dayjs from 'dayjs';
import formatDate from '@helpers/formateDate';

interface CategoryOption {
    label: string;
    id: number;
}

const Expense: React.FC = () => {
    const accounts: string[] = useSelector((state: RootState) => state.accounts);
    const expenses: string[] = useSelector((state: RootState) => state.expenses);
    const dispatch = useDispatch();
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    const [data, setData] = useState<IExpense>({
        account: "",
        sum: null,
        date: formattedDate,
        category: "",
        comment: ""
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setData((prevData) => ({
            ...prevData,
            [name]: name === "sum" ? Number(value) : value,
        }));
    };

    const categoryChange = (event: React.SyntheticEvent, newValue: CategoryOption | null): void => {
        if (!newValue) return;
        setData({
            ...data,
            "category": newValue.label,
        });
    };

    const send = (): void => {
        if (validation()) {
            return;
        }
        dispatch(addTransaction(data));
        setData({
            account: "",
            sum: null,
            date: "",
            category: "",
            comment: ""
        })
    };

    const validation = () => {
        return data.account === "" || data.sum === 0 || data.sum === null || data.category === ""
    }

    const disabled = validation();

    return (
        <Box>
            <Box className={classes.inputBlock}>
                <FormControl fullWidth>
                    <InputLabel required id="demo-simple-select-label">
                        Account
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={data.account}
                        label="Account"
                        onChange={handleChange}
                        name="account"
                    >
                        {accounts.map((account, index) => (
                            <MenuItem value={account} key={index}>{account}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <TextField
                        sx={{ width: '50%' }}
                        onChange={handleChange}
                        value={data.sum}
                        id="outlined-basic"
                        label={"Sum"}
                        required
                        variant="outlined"
                        name="sum"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            sx={{ width: '50%' }}
                            defaultValue={dayjs(data.date)}
                            label={"Date"}
                            inputFormat="DD/MM/YYYY"
                            onChange={(date) => handleChange({ target: { name: 'date', value: date } })}
                            renderInput={(params) => <TextField value={data.date} variant="outlined" {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
                <Autocomplete
                    onChange={categoryChange}
                    disablePortal
                    id="combo-box-demo"
                    options={expenses.map((expense, index) => ({ label: expense, id: index }))}
                    value={{ label: data.category, id: 0 }}
                    renderInput={(params) => <TextField {...params} required label={"Expenses category"} />}
                />
                <TextField id="outlined-multiline-static" label="Comment..." multiline rows={4} />
                <Box className={classes.Button}>
                    <Button
                        disabled={disabled}
                        onClick={send}
                        variant="contained"
                    >Submit</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Expense;
