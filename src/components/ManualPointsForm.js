// components/ManualPointsForm.js
import React, { useState } from 'react';
import { Button, TextField, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';

function ManualPointsForm({ onSubmit, localPoints, setLocalPoints }) {
    const [timestamp, setTimestamp] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleAddPoint = () => {
        if (!timestamp || !latitude || !longitude) return;

        const newPoint = {
            timestamp: new Date(timestamp).toISOString(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        setLocalPoints([...localPoints, newPoint]);
        setTimestamp('');
        setLatitude('');
        setLongitude('');
    };

    const handleRemovePoint = (index) => {
        const updatedPoints = localPoints.filter((_, i) => i !== index);
        setLocalPoints(updatedPoints);
    };

    return (
        <Box noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom style={{ marginLeft: '18rem', marginBottom: '1rem' }}>
                Add Data Points Manually
            </Typography>
            <div className="locationinput">
                <TextField
                    type="datetime-local"
                    name="timestamp"
                    required
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                />
                <TextField
                    label="Latitude(-90 to 90)"
                    type="number"
                    name="latitude"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    
                />
                <TextField
                    label="Longitude(-180 to 180)"
                    type="number"
                    name="longitude"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    
                />
                <Button variant="contained" color="primary" onClick={handleAddPoint} sx={{ mt: 2 }} style={{ marginBottom: '1rem' }}>
                    Add Point
                </Button>
            </div>

            {/* Display list of points added */}
            <List>
                {localPoints.map((point, index) => (
                    <ListItem 
                        key={index} 
                        secondaryAction={
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                onClick={() => handleRemovePoint(index)}
                            >
                                Remove
                            </Button>
                        }
                        sx={{ mb: 1, bgcolor: '#f5f5f5', borderRadius: 1, padding: 2 }}
                    >
                        <ListItemText 
                            primary={
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ mr: 1 }} /> 
                                    {new Date(point.timestamp).toLocaleString()}
                                </Typography>
                            } 
                            secondary={
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ mr: 1 }} /> 
                                    Latitude: {point.latitude}, Longitude: {point.longitude}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>

        </Box>
    );
}

export default ManualPointsForm;
