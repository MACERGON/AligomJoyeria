import React, { useEffect, useState } from 'react';
import { fetchHomeData } from '../services/api';

const Home = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHomeData().then((response) => setMessage(response.data));
    }, []);

    return (
        <div>
            <h1>Bienvenido a Aligom</h1>
            <p>{message}</p>
        </div>
    );
};

export default Home;
