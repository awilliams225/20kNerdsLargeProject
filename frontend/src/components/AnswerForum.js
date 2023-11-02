import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export default function AnswerForum() {
    
    const { questionId } = useParams();

    const [posts, setPosts] = useState({});
    const [loading, setLoading] = useState(true);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route)
    {
      if (process.env.NODE_ENV === 'production') 
      {
          return 'https://' + app_name +  '.herokuapp.com/' + route;
      }
      else
      {        
          return 'http://localhost:5000/' + route;
      }
    }

    useEffect(() => {
        const grabForum = async () => {
            setLoading(true);

            console.log(questionId);
            var obj = {QuestionId: questionId};
            var js = JSON.stringify(obj);

            console.log(js);

            const response = await fetch(buildPath('api/getPosts'), {method: 'POST',body:js,headers:{'Content-Type': 'application/json'}});
            
            if (response != null)
            {
                const json = await response.json();
    
                setPosts(json);
                
                setLoading(false);
            }
            else
            {
                console.log("Response is null");
            }
        }

        grabForum();
    }, [questionId]);

    const renderForum = () => {
        if (loading) {
            return <Spinner animation="border" />;
        }
        else {
            var postList = posts.postList;
            console.log(postList);
            return (
                <>
                    <ListGroup>
                        {postList.map((post) => (
                            <ListGroup.Item action variant="dark" href={questionId + "/post/" + post.Slug}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{post.Title}</Card.Title>
                                        <Card.Text>{post.Content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderForum()}
            </div>
        </>
    )

}
