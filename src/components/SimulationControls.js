import React, { useEffect, useRef } from 'react';
import { Button, Slider, Typography } from '@mui/material';

function SimulationControls({
    points,
    isPlaying,
    currentIndex,
    seekValue,
    simulationTime,
    setCurrentIndex,
    setSeekValue,
    setSimulationTime,
    setIsPlaying,
    onSimulationStart,
    onUpdatePosition, 
    pathName,
}) {
    const intervalRef = useRef(null);

    const startSimulation = (startValue) => {
        const startIndex = Math.floor(startValue); 
        const fractionalProgress = startValue - startIndex;
      
        setIsPlaying(true);
        setCurrentIndex(startIndex);

        const { latitude, longitude } = points[startIndex];
        onSimulationStart({ latitude, longitude });

        const advanceSimulation = (index, progress = fractionalProgress) => {
            if (index >= points.length - 1) {
                clearInterval(intervalRef.current);
                setIsPlaying(false);
                return;
            }

            const nextIndex = index + 1;
            const currentTimestamp = new Date(points[index].timestamp);
            const nextTimestamp = new Date(points[nextIndex].timestamp);
            const interval = (nextTimestamp - currentTimestamp) / 1000; // Interval in seconds

            // Start elapsed time based on the fractional progress
            let elapsedTime = progress * interval;

            const update = () => {
                elapsedTime += 1;

                // Interpolate based on elapsed time for smooth transitions
                const progressFraction = Math.min(elapsedTime / interval, 1);
                const currentLat = points[index].latitude;
                const currentLon = points[index].longitude;
                const nextLat = points[nextIndex].latitude;
                const nextLon = points[nextIndex].longitude;

                const newLat = currentLat + (nextLat - currentLat) * progressFraction;
                const newLon = currentLon + (nextLon - currentLon) * progressFraction;

                onUpdatePosition(newLat, newLon);

                // Update seek value to reflect the exact progress
                setSeekValue(index + progressFraction);
                setCurrentIndex(index);
                setSimulationTime(points[nextIndex].timestamp);

                if (elapsedTime >= interval) {
                    clearInterval(intervalRef.current);
                    advanceSimulation(nextIndex); // Move to next
                }
            };

            // Clear any existing interval before starting a new one
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(update, 1000);
        };

        advanceSimulation(startIndex, fractionalProgress); // Start from clicked point
    };

    const pauseSimulation = () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleSliderChange = (event, value) => {
        if (isPlaying) {
            pauseSimulation();
        }

        setSeekValue(value); // Update position on slider
        startSimulation(value); // Start from clicked position
    };

    const sliderMarks = points.length <= 4 
    ? points.map((point, index) => ({
        value: index,
        label: new Date(point.timestamp).toLocaleTimeString(),
      }))
    : Array.from({ length: 4 }, (_, i) => {
        const index = Math.floor((points.length - 1) * (i / 3));
        return {
          value: index,
          label: new Date(points[index].timestamp).toLocaleTimeString(),
        };
      });



    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div style={{marginLeft:'55px'}}>
            <div className='Startsimulationbtn'>
            <Typography 
                    variant="h6" 
                    style={{
                        fontWeight: 'bold', 
                        color: '#1976d2', 
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        marginRight: '20px'
                    }}
                >
                    {pathName}
                </Typography>           
             <Button onClick={isPlaying ? pauseSimulation : () => startSimulation(seekValue)} variant="contained" color="primary" style={{marginLeft:'80px' , width:'175px'}}>
                {isPlaying ? 'Pause' : 'Start Simulation'}
            </Button>
            </div>
            <Slider
                min={0}
                max={points.length - 1}
                value={seekValue}
                onChange={handleSliderChange}
                marks={sliderMarks}
                step={0.01}
                sx={{ mt: 2 }}
            />
        </div>
    );
}

export default SimulationControls;
