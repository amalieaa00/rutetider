import '../tableStyles.css'
function Table({ data }) {
    return (
        <div>
            <h4>All</h4>
            <table>
                <thead>
                    <tr>
                        <th>Expected Departure Time</th>
                        <th>Aimed Departure Time</th>
                        <th>Destination</th>
                        <th>Public Code</th>
                        <th>Transport Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.expectedDepartureTime}</td>
                            <td>{entry.aimedDepartureTime}</td>
                            <td>{entry.frontText}</td>
                            <td>{entry.publicCode}</td>
                            <td>{entry.transportMode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
