import React from 'react';

export default function LoggedInName()
{
	
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;

    const doLogout = event => 
    {
	    event.preventDefault();

        localStorage.removeItem("user_data")
        window.location.href = '/';

    };    

  return(
   <div id="loggedInDiv">
   <span id="userName">Logged In As</span><br />
   <button type="button" id="logoutButton" class="buttons" 
     onClick={doLogout}> Log Out </button>
   </div>
  );

}
