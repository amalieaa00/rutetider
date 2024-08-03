const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const HEADER = {
    'ET-Client-Name': 'amalieaa00-rutetider',
    'Content-Type': 'application/json'
};

// Function to fetch stop IDs
const getStopIds = async (name) => {
    try {
        const response = await fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${name}&lang=en`, {
            method: 'GET',
            headers: HEADER,
        });
        const data = await response.json();

        return data.features
            .filter(feature => feature.properties.id)
            .map(feature => feature.properties.id);
    } catch (error) {
        console.error('Error fetching stop IDs:', error);
        return [];
    }
};

// Function to fetch journey planner data using stop IDs
const getTimeData = async (stopId, transportModes) => {
    const query = `{
        stopPlace(id: "${stopId}") {
            name
            id
            estimatedCalls(numberOfDepartures: 5, whiteListedModes: ${transportModes}) {
                expectedDepartureTime
                aimedDepartureTime
                destinationDisplay {
                    frontText
                }
                serviceJourney {
                    line {
                        publicCode
                        transportMode
                    }
                }
            }
        }
    }`;

    try {
        const response = await fetch('https://api.entur.io/journey-planner/v2/graphql', {
            method: 'POST',
            headers: HEADER,
            body: JSON.stringify({ query }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching journey planner data:', error);
        return null;
    }
};

// Main function to coordinate fetching stop IDs and journey planner data
const getTableData = async (stop, transportModes, res) => {
    try {
        const stopIds = await getStopIds(stop);
        if (!stopIds.length) {
            return res.status(404).json({ error: 'No stop IDs found for the given stop' });
        }

        const deps = await getTimeData(stopIds[0], transportModes);
        if (!deps || !deps.data || !deps.data.stopPlace || !deps.data.stopPlace.estimatedCalls) {
            return res.status(500).json({ error: 'No departure data found for the given stop' });
        }

        return res.json(deps.data.stopPlace.estimatedCalls);
    } catch (error) {
        console.error('Error in getTableData:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

app.post('/getTimeTable', (req, res) => {
    const { stop, selectedTransport } = req.body;
    getTableData(stop, selectedTransport, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
