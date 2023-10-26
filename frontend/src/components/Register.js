import React, { useState } from 'react';

function Register()
{

  var registerName;
  var registerPassword;
  var registerEmail;

  const [message,setMessage] = useState('');

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

  const doRegister = async event => 
  {
      event.preventDefault();

      var obj = {username:registerName.value,password:registerPassword.value,
                 email:registerEmail.value};
      var js = JSON.stringify(obj);

      try
      {    
          const response = await fetch(buildPath('api/register'),
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          var res = JSON.parse(await response.text());

          if( res.id <= 0 )
          {
              setMessage('User/Password combination incorrect');
          }
          else
          {
              var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/cards';
          }
      }
      catch(e)
      {
          alert(e.toString());
          return;
      }    
  };

    return(
      <div id="RegisterDiv" style={{backgroundColor: '#4BBCD5', height: '50vh', width: '75%',
           borderRadius: '0px 15px 15px 0px', float: 'left', marginTop: '10vh',
           textAlign: 'center', padding: '5vh'}}>
            <form onSubmit={doRegister} style={{}}>
                <span id="inner-title" style={{color: '#FFFFFF', marginTop: '20px'}}>Sign Up</span><br />
                <input type="text" id="registerName" placeholder="Username"
                    ref={(c) => registerName = c} /><br />
                <input type="email" id="registerEmail" placeholder="Email"
                    ref={(c) => registerEmail = c} /><br />
                <input type="password" id="registerPassword" placeholder="Password"
                    ref={(c) => registerPassword = c} /><br />
                <input type="submit" id="lregisterButton" class="buttons" value="Create Account"
                    onClick={doRegister} />
            </form>
            <span id="registerResult">{message}</span>
        </div>
    );
};

export default Register;
