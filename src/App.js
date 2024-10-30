import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import MapComponent from './components/MapComponent';
import FileUpload from './components/FileUpload';
import ManualPointsForm from './components/ManualPointsForm';
import SimulationControls from './components/SimulationControls';
import './styles.css';
import { Button, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const [dronePaths, setDronePaths] = useState([]);
    const [drones, setDrones] = useState([]);
    const [simulationTime, setSimulationTime] = useState(0);
    const [startCoordinates, setStartCoordinates] = useState(null);
    const [currentPositions, setCurrentPositions] = useState([]);
    const [localPoints, setLocalPoints] = useState([]);
    const [filePoints, setFilePoints] = useState([]);
    const [pathName, setPathName] = useState(''); // State for path name
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const intervalRefs = useRef([]);

    const handleSimulationStart = (coordinates) => {
        setStartCoordinates(coordinates);
    };

    const handleUpdatePosition = (index, newLat, newLon) => {
        setCurrentPositions((prevPositions) => {
            const updatedPositions = [...prevPositions];
            updatedPositions[index] = { latitude: newLat, longitude: newLon };
            return updatedPositions;
        });
    };

    const handleFileUpload = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const parsedPoints = results.data
                    .filter(row => row.timestamp && row.latitude && row.longitude)
                    .map((row) => ({
                        timestamp: new Date(row.timestamp).toISOString(),
                        latitude: parseFloat(row.latitude),
                        longitude: parseFloat(row.longitude),
                    }))
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setFileName(file.name);
                setFilePoints(parsedPoints);
            },
            error: (error) => {
                console.error("Error parsing file:", error);
            },
        });
    };


    const handleManualSubmit = () => {
        const sortedManualPoints = [...localPoints].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        if (!pathName) {
            setError('Please provide a name for the path.');
            return;
        }
        if(localPoints.length===1 || filePoints.length===1){
            setError('Data Points Should be more than one, Please add more points');
            return;
        }

        if (localPoints.length > 0 && filePoints.length === 0) {
            setDronePaths((prevPaths) => [...prevPaths, sortedManualPoints]);
            setDrones((prevDrones) => [
                ...prevDrones,
                { isPlaying: false, currentIndex: 0, seekValue: 0 , pathName },
            ]);
            intervalRefs.current.push(null);
            setLocalPoints([]);
            setPathName('');
        } else if (filePoints.length > 0 && localPoints.length === 0) {
            setDronePaths((prevPaths) => [...prevPaths, filePoints]);
            setDrones((prevDrones) => [
                ...prevDrones,
                { isPlaying: false, currentIndex: 0, seekValue: 0 , pathName },
            ]);
            intervalRefs.current.push(null);
            setFileName('');
            setFilePoints([]);
            setPathName('');
        } 
        else {
            setError('Please provide points from either manual input or file upload, not both or neither.');
        }
    };

    const updateDroneState = (index, newState) => {
        setDrones((prevDrones) =>
            prevDrones.map((drone, i) => (i === index ? { ...drone, ...newState } : drone))
        );
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    const mapWidth = drones.length === 0 ? '100%' : '70%';

    return (
        <div className="Appcontainer">
            <div className="Pointsupload">
            <ManualPointsForm localPoints={localPoints} setLocalPoints={setLocalPoints} />
            <FileUpload onFileUpload={handleFileUpload} fileName={fileName}/>
            </div>
            <div className="SubmitDiv">
            <TextField
                label="Enter Path Name"
                variant="outlined"
                value={pathName}
                onChange={(e) => setPathName(e.target.value)}
                sx={{ mb: 2 }}
                style={{width:'150px' , marginTop:'2rem'}}
            />
            <Button variant="contained" color="secondary" onClick={handleManualSubmit} sx={{ mt: 2 }}>
                Submit Path
            </Button>
            </div>
            <div className="Mapcomponent">
                <MapComponent
                    paths={dronePaths}
                    currentIndexes={drones.map((drone) => drone.currentIndex)}  
                    startCoordinates={startCoordinates}
                    currentPositions={currentPositions}
                    width={mapWidth}  
                />
                <div className="DroneSimulation">
                    {drones.map((drone, index) => (
                        <SimulationControls
                            key={index}
                            points={dronePaths[index]}
                            isPlaying={drone.isPlaying}
                            currentIndex={drone.currentIndex}
                            seekValue={drone.seekValue}
                            intervalRef={intervalRefs.current[index]}
                            setIsPlaying={(isPlaying) => updateDroneState(index, { isPlaying })}
                            setCurrentIndex={(currentIndex) => updateDroneState(index, { currentIndex })}
                            setSimulationTime={setSimulationTime}
                            simulationTime={simulationTime}
                            setSeekValue={(newSeekValue) => updateDroneState(index, { seekValue: newSeekValue })}
                            onSimulationStart={handleSimulationStart}
                            onUpdatePosition={(newLat, newLon) => handleUpdatePosition(index, newLat, newLon)} 
                            pathName={drone.pathName}
                        />
                    ))}
                </div>
            </div>
            
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App;
