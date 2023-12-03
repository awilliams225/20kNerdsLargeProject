import React from 'react';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function StanceInfo() {

    return (
        <OverlayTrigger placement='bottom' overlay={
            <Tooltip>
                <h3>What is this?</h3>
                This is your <b>stance.</b> In <b style={{color: 'orange'}}>fight</b> mode, you can argue with people about this topic, while in <b style={{color: 'cyan'}}>flight</b> mode, you can talk to other people who feel the same way as you. You cannot change your stance on a question once you answer it, so choose wisely!
            </Tooltip>
        }>
            <Badge pill bg="secondary" className="m-2">i</Badge>
        </OverlayTrigger>
    )

}
