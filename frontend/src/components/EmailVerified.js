import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function EmailVerified() {

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:3000/' + route;
        }
    }

    return (
        <>
        <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '16rem' }}>
            <Card.Body>
                <Card.Title>You May Now Join The Fight!</Card.Title>
                <Card.Text>
                    Your email has now been verified!
                    Click the button below to be taken back
                    to our login page, and begin fighting!
                    ...or flighting!
                </Card.Text>
            </Card.Body>
            <Button variant='primary' href={buildPath('')}>
                Go To Login
            </Button>
        </Card>
        </>
    )
}