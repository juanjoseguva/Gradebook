import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    // variables and constants
    const headers = ['Enrollment ID', 'Course ID', 'Section', 'Building', 'Room', 'Times', 'Credits', ''];
    const [enrollments, setEnrollments] = useState([]);
    const [search, setSearch] = useState({year:'', semester:''});
    const [message, setMessage] = useState('');

    // receive enrollments from database (i think)
    const fetchEnrollments = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(
                `${SERVER_URL}/enrollments?year=${search.year}&semester=${search.semester}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': jwt
                    }
                });
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
                setMessage("");
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const deleteEnrollment = async (enrollmentId) => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch (`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
            });
            if (response.ok) {
                setMessage("Enrollment deleted");
                fetchEnrollments();
            } else {
                const rc = await response.json();
                setMessage("Delete failed "+rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err + " enrollmentid: " + `${enrollmentId}`);
        }
    }

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const enrollmentId = enrollments[row_idx].enrollmentId;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [{
                label: 'Yes',
                onClick: () => deleteEnrollment(enrollmentId)
            },{
                label: 'No',
            }]
        });
    }

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value});
    }

    // return to display
    return(
        < > 
            <h3>Class Schedule</h3>
            <h4>{message}</h4>

            {
            //prompt
            }
            <h4>Enter year and semester. Example: 2024 Spring</h4>
            <table className="Center">
                <tbody>
                    <tr>
                        <td>Year:</td>
                        <td><input type="text" id="ayear" name="year" value={search.year} onChange={editChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester:</td>
                        <td><input type="text" id="asemester" name="semester" value={search.semester} onChange={editChange} /></td>
                    </tr>
                </tbody>
            </table>
            <br/>

            <button type="submit" id="search" onClick={fetchEnrollments} >Search for Schedule</button>
            <br/>
            <br/>

            {
            //enrollment table list
            }
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((e, idx) => (<th key={idx}>{e}</th>))}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e) => (
                    <tr key={e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.courseId}</td>
                        <td>{e.sectionNo}</td>
                        <td>{e.building}</td>
                        <td>{e.room}</td>
                        <td>{e.times}</td>
                        <td>{e.credits}</td>
                        <td><Button onClick={onDelete}>Drop</Button></td>
                    </tr>
                    ))}
                </tbody>
            </table>


        </ >
    );
}
export default ScheduleView;