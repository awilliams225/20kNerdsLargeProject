import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';


export default function Post() {
    const { questionId, slug } = useParams();

    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(false);

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
        const grabPost = async () => {
            setLoading(true);

            const response = await fetch(buildPath('api/posts/' + slug), {method: 'GET'})
            
            if (response != null)
            {
                const json = await response.json();
    
                setPost(json);

                setLoading(false);
            }
            else
            {
                console.log("Response is null");
            }
        }

        grabPost();
    }, [slug]);

    const renderPost = () => {
        if (loading) {
            return <h1>Loading...</h1>
        }
        else {
            return (
                <>
                <h1>{ post.Content }</h1>
                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderPost()}
            </div>
        </>
    )

}
