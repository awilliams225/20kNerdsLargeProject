import 'package:fightorflightandroid/loggedin.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

String Username = '';
String Password = '';
String Email = '';
TextEditingController Usernamecontroller = TextEditingController();
TextEditingController Passwordcontroller = TextEditingController();
TextEditingController Emailcontroller = TextEditingController();

class RegistrationPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

Future<void> postData() async {
  print('${Usernamecontroller.text}');
  print('${Passwordcontroller.text}');
  print('${Emailcontroller.text}');
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/register'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'username': Usernamecontroller.text,
      'password': Passwordcontroller.text,
      'email': Emailcontroller.text,
    }),
  );
  if (response.statusCode == 200) {
    // The request was successful. You can parse the response here.
    print('Response data: ${response.body}');
    Map<String, dynamic> jsonMap = jsonDecode(response.body);

    //message to register?
    //move to home screen, save user id
    print(jsonMap);
  } else {
    // The request failed or the response is not a 201 Created status.
    print('Request failed with status: ${response.statusCode}');
  }
}

class _RegisterPageState extends State<RegistrationPage> {
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.white,
     /*   appBar: AppBar(
          elevation: 0,
          backgroundColor: Colors.white,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
          ),
        ),*/
        body: Container(
          height: MediaQuery
              .of(context)
              .size
              .height,
          width: double.infinity,
          decoration: BoxDecoration(color: Color(0xff817D8E)),

          child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Column(
                    children: [
          Row(children:[
              IconButton(
              onPressed: () {
        Navigator.pop(context);
        },
          icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.black),
        ),
                      Text("Register",
                          style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: Colors.white)),
                      SizedBox(height: 20)
                    ]
                )]),
                Column(children: <Widget>[
                  TextField(controller: Usernamecontroller,
                      onSubmitted: (text) {
                        setState(() {
                          Username = Usernamecontroller.text;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: 'Username',
                      )),
                  TextField(controller: Passwordcontroller,
                      onSubmitted: (text) {
                        setState(() {
                          Password = Passwordcontroller.text;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: 'Password',
                      )
                  ),
                  TextField(controller: Emailcontroller,
                      onSubmitted: (text) {
                        setState(() {
                          Email = Emailcontroller.text;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: 'Email',
                      )
                  ),
                ],
                ),
                MaterialButton(
                  minWidth: double.infinity,
                  height: 60,
                  onPressed: () {
                    postData();
                  },
                  color: Color(0xff0095FF),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50),

                  ),
                  child:  MaterialButton(onPressed: () {
                    Navigator.pop(context);
                  }, child:Text(
                    "Join the Fight!", style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 18,
                    color: Colors.white,
                  ),
                  ),
                )),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("Have an account?",
                        style: TextStyle(color: Colors.white)),
                    MaterialButton(onPressed: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (context) => LoginPage()));
                    }, child:
                    Text("Login", style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                        fontSize: 18
                    ),
                    )
                    ),
                  ],
                )
              ]),
        ));
  }
}