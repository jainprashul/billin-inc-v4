// import * as React from "react";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
// import parse from "autosuggest-highlight/parse";
// import match from "autosuggest-highlight/match";

// export interface FilterOption {
//   label: string;
//   value: string;
//   inputValue?: string;
// }

// const filter = createFilterOptions<FilterOption>();

// type Props = {
//   title?: string;
//   values?: FilterOption[];
//   defaultSelect?: FilterOption[];
//   onSelected?: (values: FilterOption[]) => void;
// };

// export default function MultiSelectAdd({
//   title = "Add & Select",
//   values = [],
//   defaultSelect = [],
//   onSelected = (values) => console.log("Selected Values: ", values?.map(v => v.value))
// }: Props) {
//   const [data, setData] = React.useState<FilterOption[]>(values || []);
//   const [selected, setSelected] = React.useState<FilterOption[]>(defaultSelect || []);

//   // rerun the the onSelected callback when the selected values change
//   React.useEffect(() => {
//     onSelected(selected);
//   }, [selected]);

//   const [open, toggleOpen] = React.useState(false);

//   /* istanbul ignore next */
//   const handleClose = () => {
//     setDialogValue({
//       label: "",
//       value: "",
//     });
//     toggleOpen(false);
//   };

//   const [dialogValue, setDialogValue] = React.useState({
//     label: "",
//     value: "",
//   });

//   /* istanbul ignore next */
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setSelected((data) => [...(data || []), dialogValue]);
//     setData((data) => [...(data || []), dialogValue]);
//     handleClose();
//   };

//   return (
//     <React.Fragment>
//       <Autocomplete
//         value={selected}
//         multiple
//         style={{
//           flexGrow: 1,
//         }}
//         onChange={(event, newValue, reason, details) => {
//           // console.group("ON change");
//           // console.log("New Value :", newValue);
//           // console.log("Reason :", reason);
//           // console.log("Details :", details);
//           // console.groupEnd();

//           const latestSelected = newValue.at(-1);
//           if (typeof latestSelected === "string") {
//             // timeout to avoid instant validation of the dialog's form.
//             /* istanbul ignore next */
//             setTimeout(() => {
//               toggleOpen(true);
//               setDialogValue({
//                 label: latestSelected,
//                 value: latestSelected,
//               });
//             });
//           } else if (latestSelected && latestSelected.inputValue) {
//             toggleOpen(true);
//             setDialogValue({
//               label: latestSelected.inputValue,
//               value: latestSelected.inputValue,
//             });
//           } else {
//             // setValue(newValue);
//             setSelected(newValue as FilterOption[]);
//           }
//         }}
//         filterOptions={(options, params) => {
//           // console.log("BEFORE FILTER :", options);

//           const filtered = filter(options, params);
//           // Suggest the creation of a new value
//           const { inputValue } = params;
//           const isExisting = options.some(
//             (option) => inputValue.trim().toLowerCase() === option.value.toLowerCase()
//           );

//           if (params.inputValue !== "" && !isExisting) {
//             filtered.push({
//               inputValue: params.inputValue,
//               label: `Add "${params.inputValue}"`,
//               value: params.inputValue,
//             });
//           }

//           return filtered;
//         }}
//         id="multi-select-add"
//         options={data}
//         getOptionLabel={(option) => {
//           // e.g value selected with enter, right from the input
//           if (typeof option === "string") {
//             return option;
//           }
//           if (option.inputValue) {
//             return option.inputValue;
//           }
//           return option.label;
//         }}
//         selectOnFocus
//         clearOnBlur
//         handleHomeEndKeys
//         renderOption={(props, option, { inputValue }) => {
//           const matches = match(option.label, inputValue);
//           const parts = parse(option.label, matches);

//           return (
//             <li {...props} value={option.value}>
//               <div>
//                 {parts.map((part, index) => (
//                   <span
//                     key={index}
//                     style={{
//                       fontWeight: part.highlight ? 700 : 400,
//                     }}
//                   >
//                     {part.text}
//                   </span>
//                 ))}
//               </div>
//             </li>
//           );
//         }}
//         sx={{ width: 300 }}
//         freeSolo
//         renderInput={(params) => <TextField margin="normal" {...params} label={title} role="multiValueInput" />}
//       />

//       <Dialog open={open} onClose={handleClose}>
//         <form onSubmit={handleSubmit}>
//           <DialogTitle>Add a new value</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Please enter the value you want to add:
//             </DialogContentText>
//             <TextField
//               autoFocus={true}
//               margin="dense"
//               id="name"
//               value={dialogValue.label}
//               onChange={(event) =>
//                 setDialogValue({
//                   ...dialogValue,
//                   label: event.target.value.trim(),
//                   value: event.target.value.trim(),
//                 })
//               }
//               label="New Value"
//               type="text"
//               variant="standard"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit">Add</Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </React.Fragment>
//   );
// }

export {
    
}
