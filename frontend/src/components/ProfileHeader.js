import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

export default function ProfileHeader() {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const { userId } = useParams();

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    useEffect(() => {
        const grabUser = async () => {
            setLoading(true);

            var obj = { userId: userId };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath('api/getUserByUserId'), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } })

            if (response != null) {
                const json = await response.json();

                setUser(json);

                console.log(user);

                setLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabUser();
    }, []);


    const renderHeader = () => {
        if (loading) {
            return <Spinner animation="border" />;
        }
        else {
            return (
                <>
                    <Card className="my-4 shadow border-5">
                        <Card.Header>
                            <Card.Title>Welcome to <b>{user.results.Username}</b>'s Profile!</Card.Title>
                        </Card.Header>
                    </Card>
                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderHeader()}
            </div>
        </>
    )

}
