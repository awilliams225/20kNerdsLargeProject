import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/loggedin.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

TextEditingController Usernamecontroller = TextEditingController();
TextEditingController Passwordcontroller = TextEditingController();

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  Future<void> postData() async {
    print('${Usernamecontroller.text}');
    print('${Passwordcontroller.text}');
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'login': Usernamecontroller.text,
        'password': Passwordcontroller.text,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (jsonMap['id'] != -1) {
      print(jsonMap['id']);
      // The request was successful. You can parse the response here.
      print('Response data: ${response.body}');
      //message to login?
      //move to next screen, save user id
      print(jsonMap);
      Navigator.push(context, MaterialPageRoute(builder: (context) => LoggedinPage()));

    } else {
      // The request failed or the response is not a 200 Created status.
      print("Not Logged In. Please try again.");
    }
  }

  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Color(0xffF34213),
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
            Expanded(child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Column(
                  children: <Widget>[
                    Row(children:[
                    IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.black),
                    ),
                    Text("Login",
                        style: TextStyle(fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.white))]),
                    SizedBox(height: 20)
                  ],
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    children: <Widget>[
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
                      ), //in// utFile(label: "Password", obscureText: true)
                    ],
                  ),
                ),
                Padding(padding:
                EdgeInsets.symmetric(horizontal: 40),
                  child: Container(
                    padding: EdgeInsets.only(top: 3, left: 3),
                    decoration:
                    BoxDecoration(
                        borderRadius: BorderRadius.circular(50),
                        border: Border(
                          bottom: BorderSide(color: Colors.black),
                          top: BorderSide(color: Colors.black),
                          left: BorderSide(color: Colors.black),
                          right: BorderSide(color: Colors.black),
                        )
                    ),
                    child: MaterialButton(
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
                        child: Text(
                          "Take Me To The Fight!", style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 18,
                          color: Colors.white,
                        ),
                        )
                    ),
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("New to Fight or Flight?", style: TextStyle(color: Colors.white,
                        fontWeight: FontWeight.w300,
                        fontSize: 16)),
                    MaterialButton(onPressed: () {
                      Navigator.push(context, MaterialPageRoute(
                          builder: (context) => RegistrationPage()));
                    }, child:
                    Text("Register Now!", style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                      fontSize: 18,
                    )))
                  ],
                ),
              ],
            ))
          ],
        ),
      ),
    );
  }
}
