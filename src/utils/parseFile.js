export const parseFile = (file, setTimeSeries) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = content.split('\n').map((row) => {
        const [latitude, longitude] = row.split(',');
        return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      });
      setTimeSeries(parsedData);
    };
    reader.readAsText(file);
  };
  