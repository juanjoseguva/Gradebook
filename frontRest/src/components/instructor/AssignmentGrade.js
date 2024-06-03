import React, { useState, useEffect } from 'react';
import {SERVER_URL} from '../../Constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AssignmentGrade = (props) => {

    const headers = ['Grade ID', 'Student Name', 'Student Email', 'Score', ''];
    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [grades, setGrades] = useState([]);

    const editOpen = () => {
        setEditMessage('');
        setOpen(true);
        fetchGrades();
    };

    const editClose = () => {
        setOpen(false);
        setGrades([]);
        setEditMessage('');
    };

    const onChange = (event) => {
        setGrades([...grades]);
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        grades[row_idx].score = event.target.value;
    }
    const onSave = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/grades`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify(grades)
            });
            if (response.ok) {
                setEditMessage("Grades saved!");
            } else {
                const rc = await response.json();
                setEditMessage("Response error: " + rc.message);
            }
        } catch (err) {
            setEditMessage("Network error: " + err);
        }
    }

    const fetchGrades = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(
                `${SERVER_URL}/assignments/${props.asgnmtId}/grades`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": jwt
                    }
                });
            if (response.ok) {
                const grades = await response.json();
                setGrades(grades);
            } else {
                const rc = await response.json();
                setEditMessage("Response error: " + rc.message);
            }
        } catch (err) {
            setEditMessage("network error: " + err);
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Grades</Button>
            <Dialog open={open} >
                <DialogTitle>Assignment Grades</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }} >
                    <h4 id="editMessage">{editMessage}</h4>
                    <table className="Center" >
                        <thead>
                        <tr>
                            {headers.map((g, idx) => (<th key={idx}>{g}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {grades.map((g, idx) => (
                            <tr key={g.gradeId}>
                                <td>{g.gradeId}</td>
                                <td>{g.studentName}</td>
                                <td>{g.studentEmail}</td>
                                <td><input type="text" name="score" value={g.score} onChange={onChange} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button id="closeGrades" color="secondary" onClick={editClose}>Close</Button>
                    <Button id="saveGrades" color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default AssignmentGrade;