import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';


const InstructorHome = () => {

    const [term, setTerm] = useState({year:'', semester:''});
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");

    const onChange = (event) => {
        setTerm({...term, [event.target.name]:event.target.value});
    }

    const updateLink= () => {
        if(term.year==="" ){
            setMessage("Please enter a valid year.");
            setLink("");
            return;
        }else if(term.semester===""){
            setMessage("Please enter a valid semester");
            setLink("");
            return;
        }else{
            setLink(<Link to='/sections' state={term}>Show Sections</Link>);
        }
    }


    return (
        <>
            <p>{message}</p>
            <table className="Center">
            <tbody>
            <tr>
                <td>Year:</td>
                <td><input type="number" id="year" name="year" value={term.year} onChange={onChange} onBlur={updateLink} /></td>
            </tr>
            <tr>
                <td>Semester:</td>
                <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} onBlur={updateLink} /></td>
            </tr>
            </tbody>
            </table>
            <div>
                {link}
            </div>
        </>
    )
};

export default InstructorHome;
