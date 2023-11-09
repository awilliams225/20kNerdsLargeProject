import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function Paginator(props) {
    // BEHOLD, THE PAGINATOR!!!!!!!!!!!!!!!!!!! -Heinz Doofenshmirtz

    let items = [];

    const activePage = parseInt(props.activePage);
    const numPages = props.numPages;

    for (let i = 1; i <= props.numPages; i++) {
        items.push(
            <Pagination.Item key={i} active={i === parseInt(props.activePage)} href={"" + i}>
                {i}
            </Pagination.Item>
        )
    }

    return (
        <>
            <Pagination className="mt-3" onChange={props.updatePaginator}>
                <Pagination.First disabled={activePage === 1} href={"1"} />
                <Pagination.Prev disabled={activePage === 1} href={"" + (activePage - 1)} />

                {items}

                <Pagination.Next disabled={activePage === numPages} href={"" + (activePage + 1)} />
                <Pagination.Last disabled={activePage === numPages} href={"" + numPages} />
            </Pagination>
        </>
    )

}
