# Drone Simulator

A web-based drone simulator that visualizes drone paths and current positions on an interactive map using Mapbox.

## Features

- **Interactive Map**: Displays drone paths and current positions on a Mapbox map.
- **Real-Time Updates**: Updates the drone's position dynamically based on the provided data.
- **Multi-Path Support**: Visualizes multiple drone paths simultaneously.
- **File Upload**: Allows users to upload files containing drone path data for easy simulation.
- **Manual Input**: Users can manually input time series data for the drone's flight path.
- **Current Position Markers**: Indicates the current position of each drone with markers on the map.
- **Start Simulation**: When the "Start Simulate" button is clicked, the map displays markers representing the drones, along with the entire expected path they will follow.
- **Pause and Resume**: Users can pause and resume the simulation at any time.When the simulation is resumed, the map will move to the current position of the path being simulated.
- **Seek Bar**: A seek bar allows users to jump to any point in the simulation while it is running, enabling them to view specific times of interest.


## Technologies Used

- **React**: For building the user interface.
- **Mapbox GL JS**: For interactive maps and geographical data visualization.
- **JavaScript**: Core programming language for the project.
- **CSS**: For styling the components.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/drone-simulator.git
2. **Navigate to the project directory**
   ```bash
   cd drone-simulator
3. **Install the dependencies**
   ```bash
   npm install
4. **Add your environment variables Create a .env file in the root directory and add your Mapbox access token**
   ```bash
   REACT_APP_MAPBOX_ACCESS_TOKEN=your_access_token
5. **Run the application**
   ```bash
   npm start





