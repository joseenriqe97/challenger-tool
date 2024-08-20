import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getFiles } from '../../util/service';
import Spinner from 'react-bootstrap/Spinner';

import './style.css';

export default function FilesTable() {
    //VARIABLES
    const [showSpinnerRunner, setShowSpinnerRunner] = useState(false);
    const [files, setFiles] = useState([]);
    const columns = [
        { label: "File Name", value: "file" },
        { label: "Text", value: "text" },
        { label: "Number", value: "number" },
        { label: "Hex", value: "hex" },
    ];

    //HOOKS     
    useEffect(() => {
        const fetchData = async () => {
            setShowSpinnerRunner(true);
            try {
                const response = await getFiles();
                setFiles(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setShowSpinnerRunner(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="label-container">
            <div className="header">
                <div className="margin-header">
                    <div>React Test App</div>
                </div>
            </div>
            <div className="padding-tablet ">
                {showSpinnerRunner ?
                    <div className="d-flex justify-content-center">
                        <div>
                            <Spinner animation="grow" />
                        </div>
                    </div> :
                    <Table striped responsive bordered >
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index}>{column.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((row, ix) => (
                                <tr key={ix}>{columns.map((r) => <td key={r.value}>{row[r.value]}</td>)}</tr>
                            ))}
                        </tbody>
                    </Table>}
            </div>
        </div>
    );
}
