import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects
// the table should have columns for
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {

    const headers = ['Year', 'Semester', 'Course ID',  'Section ID', 'Title', 'Credits', 'Grade'];

    const [transcript, setTranscript] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const [ name, setName ] = useState('');

    const [ studId, setStudId ] = useState('');

    // let name = "";
    // let sId = "";

    const  fetchTranscript = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');

            const response = await fetch(
                `${SERVER_URL}/transcripts`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': jwt
                    }
                });
            if (response.ok) {
                const transcript = await response.json();
                setTranscript(transcript);
                setName(transcript[0].name);
                setStudId(transcript[0].studentId);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchTranscript();
    },  []);

    return(
        <div>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <h5>Name: {name}</h5>
            <h5>Student ID: {studId}</h5>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {transcript.slice(1).map((t) => (
                    <tr key={t.enrollmentId}>
                        <td>{t.year}</td>
                        <td>{t.semester}</td>
                        <td>{t.courseId}</td>
                        <td>{t.sectionId}</td>
                        <td>{t.courseTitle}</td>
                        <td>{t.credits}</td>
                        <td>{t.grade}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;
