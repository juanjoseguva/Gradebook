import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css 
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// students displays a list of open sections for a course
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

function CourseEnroll(props) {

    const headers = ['CourseId', 'Section No', 'Term ID',  'Building', 'Meeting Times'];

    const [sections, setSection] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const fetchOpenSections = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(
                `${SERVER_URL}/sections/open`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': jwt
                    }
                });
            if (response.ok) {
                const sections = await response.json();
                setSection(sections);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error " +err);
        }
    }

    useEffect( () => {
        fetchOpenSections();
    }, [] );

    // the student can select a section and enroll
    // issue a POST with the URL /enrollments?secNo= &studentId=3
    // studentId=3 will be removed in assignment 7.


    const addCourse = async (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const sectionNo = sections[row_idx].secNo;

        try {
            const jwt = sessionStorage.getItem('jwt')
            const response = await fetch (`${SERVER_URL}/enrollments/sections/${sectionNo}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    //              body: JSON.stringify(section),
                });
            if (response.ok) {
                setMessage("course added")
                fetchOpenSections();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }



    return(
        <div>
            <h3>Open Sections</h3>
            <h4 id="addMessage">{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.sectionNo}>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Button onClick={addCourse}>Add Course</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default CourseEnroll;
