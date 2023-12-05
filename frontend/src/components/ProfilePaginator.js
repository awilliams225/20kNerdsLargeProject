import React from 'react';
import { useParams } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

export default function ProfilePaginator(props) {
    const { userId } = useParams();

    return (
        <>
            <Pagination className="mt-3">
                <Pagination.Item active={props.activeTab === "main"} href={`/user/${userId}/`}>
                    Info
                </Pagination.Item>
                <Pagination.Item active={props.activeTab === "post"} href={`/user/${userId}/posts/`}>
                    Posts
                </Pagination.Item>
                <Pagination.Item active={props.activeTab === "reply"} href={`/user/${userId}/replies/`}>
                    Replies
                </Pagination.Item>
            </Pagination>
        </>
    )

}
