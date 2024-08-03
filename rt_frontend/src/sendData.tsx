const sendData= async (values, url)=> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
            return data;
        } else {
            console.log("Failed");
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};
export default sendData;
