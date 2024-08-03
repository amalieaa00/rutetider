import { useState } from "react";
import sendData from '../sendData';
import Table from './Table';

function SelectParams() {
    const [tableData, setTableData] = useState([]);
    const [disp, setDisp] = useState('welcome');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [stop, setStop] = useState('');

    const getStop = (event) => {
        setStop(event.target.value);
    }

    const handleSelectChange = (event) => {
        const selected = Array.from(event.target.selectedOptions).map(option => option.value);
        setSelectedOptions(selected);
    }

    const submitForm = async (event) => {
        event.preventDefault();
        const values = { stop: stop, selectedTransport: selectedOptions };
        const response = await sendData(values, 'http://localhost:5000/getTimeTable');
        if (response) {
            const data = response.map(dep => ({
                expectedDepartureTime: dep.expectedDepartureTime,
                aimedDepartureTime: dep.aimedDepartureTime,
                frontText: dep.destinationDisplay.frontText,
                publicCode: dep.serviceJourney.line.publicCode,
                transportMode: dep.serviceJourney.line.transportMode,
            }));
            setTableData(data);
            setDisp('showDeps');
        }
    }

    const selectForm = (
        <form onSubmit={submitForm}>
            <h1>Velkommen!</h1>
            <h2>Velg stoppested:</h2>
            <label htmlFor="place">Location</label>
            <input value={stop} onChange={getStop} id='velg stoppested' aria-label='velg stoppested' placeholder='Stoppested' type="text" />
            <h2>Ønsker å se avganger for:</h2>
            <label htmlFor="ct">Se rutetider for</label>
            <select name="transport" id="ct" multiple value={selectedOptions} onChange={handleSelectChange}>
                <option value="rail">tog</option>
                <option value="bus">buss</option>
                <option value="tram">trikk</option>
                <option value="metro">T-bane</option>
            </select>
            <button type="submit">Finn reiser</button>
        </form>
    )

    if (disp === 'welcome') {
        return selectForm;
    } else {
        return <Table data={tableData} />;
    }
}

export default SelectParams;
