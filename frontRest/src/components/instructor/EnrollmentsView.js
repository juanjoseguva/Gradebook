import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import {SERVER_URL} from "../../Constants";

import Button from "@mui/material/Button";

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const [enrollments, setEnrollments] = useState([ ]);
    const headers = ['Enrollment ID', 'Student ID', 'Name', 'Email', 'Grade',''];
    const [message, setMessage] = useState('');

    const [editRow, setEditRow] = useState(-1);
    const [editEnrollment, setEditEnrollment] = useState({
        enrollmentId: "",
        grade: "",
        studentId: "",
        name: "",
        email: "",
        courseId: "",
        sectionId: "",
        sectionNo: "",
        building: "",
        room: "",
        times: "",
        credits: "",
        year: "",
        semester: ""
    });

    const fetchEnrollments = async () =>{
        try{
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(
                `${SERVER_URL}/sections/${secNo}/enrollments`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': jwt
                    }
                });
            if (response.ok){
                const enrollments = await response.json();
                setEnrollments(enrollments);
            }else{
                const json = await response.json();
                setMessage("Response error: "+json.message);
            }
        } catch (err){
            setMessage('Network Error: ' +err);
        }
    }

    const onGradeChange = async (event) =>{
        setEditEnrollment({...editEnrollment, [event.target.name]: event.target.value});
    }
    const saveGrade = async () =>{
        setEditRow(-1);

        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/enrollments`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify([editEnrollment])
            });
            if (response.ok) {
                setMessage('Grade saved');
                await fetchEnrollments();
            } else {
                const rc = await response.json();
                setMessage('Save error: '+rc.message);
            }
        } catch (err) {
            setMessage('Network error: ' + err);
        }
    }

    const onEdit = (event) =>{
        const row = event.target.parentNode.parentNode.rowIndex -1;
        const e = enrollments[row];
        setEditEnrollment({...e});
        setEditRow(row);
    }

    const displayEnrollment =(e, idx) =>{
        if(editRow!==idx) {
            return(
            <tr key={e.enrollmentId}>
                <td>{e.enrollmentId}</td>
                <td>{e.studentId}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.grade}</td>
                <td><Button onClick={onEdit} name={'changer'}>Change Grade</Button> </td>
            </tr>
            );
        } else {
            return(
            <tr key={e.enrollmentId}>
                <td>{e.enrollmentId}</td>
                <td>{e.studentId}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td><input type={'text'} name={'grade'} value={editEnrollment.grade} onChange={onGradeChange}/></td>
                <td><Button onClick={saveGrade} name={'saver'}>Save</Button></td>
            </tr>
            );
        }
    }
    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <>
            <h3>Enrollments</h3>
            <h4 name={'messager'}>{message}</h4>
            <table className={'Center'}>
                <thead>
                <tr>
                    {headers.map((h, idx) => <th key={idx}>{h}</th>)}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e, idx) =>
                    displayEnrollment(e, idx)
                )}
                </tbody>
            </table>
        </>
    );
}

export default EnrollmentsView;
