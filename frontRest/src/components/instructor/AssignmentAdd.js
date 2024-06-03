import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers";

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {
    const [isOpen, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({title: '',dueDate:'', secNo:props.sectionNo, secId:props.sectionId, courseId:props.courseId});

    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    }

    const editClose = () =>{
        setOpen(false);
        setAssignment({title:'', dueDate: ''})
        setEditMessage('');
    }

    const editChange = (event) =>{
        setAssignment({...assignment, [event.target.name]:event.target.value});
    }

    const dateChange = (date) =>{
        setAssignment({...assignment, dueDate: date.toISOString().split('T')[0]});
    }

    const onSave = () =>{
        if(assignment.title===''){
            setEditMessage('Assignment title can not be blank');
        }else if(assignment.dueDate===''){
            setEditMessage('Assignment due date can not be blank.');
        } else {
            props.save(assignment);
            editClose();
        }
    }

   // <TextField style={{padding:10}} fullWidth label={'Due Date'} name={'dueDate'} value={assignment.dueDate} onChange={editChange} />

    return (
        <>
            <Button id="addAssignment" onClick={editOpen}>Add Assignment</Button>
            <Dialog open={isOpen}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent style={{paddingTop:20}}>
                    <h4>{editMessage}</h4>
                    <TextField id="addTitle" style={{padding:10}} autoFocus fullWidth label={'Title'} name={'title'} value={assignment.title} onChange={editChange} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker id="addDueDate" name={'dueDate'} value={assignment.dueDate} onChange={date => dateChange(date)} label={'Due Date'}  />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} onClick={editClose}>Close</Button>
                    <Button id="save" color={'primary'} onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>                       
    )
}

export default AssignmentAdd;
