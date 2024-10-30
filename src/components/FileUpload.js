// components/FileUpload.js
import React from 'react';
import { Button, Typography } from '@mui/material';

function FileUpload({ onFileUpload, fileName }) {
    return (
        <div>
            <Typography variant="h5" gutterBottom style={{ marginLeft: '35px' }}>Or</Typography>
            <Typography variant="h6" gutterBottom style={{ marginLeft: '10px' }}>Upload File</Typography>
            
            <Button variant="contained" component="label">
                Upload File
                <input
                    type="file"
                    accept=".csv, .txt"
                    hidden
                    onChange={(e) => onFileUpload(e.target.files[0])}
                />
            </Button>
            
            {fileName && (
                <Typography variant="body2" style={{ marginTop: '8px' }}>
                    Selected File: {fileName}
                </Typography>
            )}

            <Typography variant="body2" style={{ marginTop: '5px',marginRight:'10px', color: 'gray' }}>
                Accepted files: .txt, .csv
            </Typography>
        </div>
    );
}

export default FileUpload;
