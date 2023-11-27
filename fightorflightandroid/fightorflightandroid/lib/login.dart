import 'package:fightorflightandroid/password.dart';
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
//  int userId = 0;
//  int get userId1 => userId;
  Future<void> postData() async {
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
      String userId = jsonMap['id'];
      print(jsonMap['id']);
  //    userId =jsonMap['id'];

      // The request was successful. You can parse the response here.
      print('Response data: ${response.body}');
      //message to login?
      //move to next screen, save user id
    //  print(jsonMap);
      Navigator.push(context, MaterialPageRoute(builder: (context) => LoggedinPage(userId: userId)));

    } else {
      // The request failed or the response is not a 200 Created status.
      print("Not Logged In. Please try again.");
    }
  }

  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Color(0xffC80202),
      body: Container(
        margin: EdgeInsets.only(left: 50, right: 50, top: 80, bottom: 80),
        height: MediaQuery.of(context).size.height,
        width: double.infinity/2,
        decoration: BoxDecoration(color: Color(0xff8545D7), borderRadius: BorderRadius.circular(20)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Expanded(child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Column(
                  children: <Widget>[
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children:[
                  /*  IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.black),
                    ),*/
                    Text("Login",
                        style: TextStyle(fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.white))]),
                    SizedBox(height: 20)
                  ],
                ),

                //Username textfield
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    children: <Widget>[
                      Container(
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                          child:
                            TextField(controller: Usernamecontroller,
                               onSubmitted: (text) {
                                  setState(() {
                                    Username = Usernamecontroller.text;
                                  });
                                },
                                decoration: InputDecoration(
                                  labelText: ' Username',
                                )
                            )
                      ),
                    SizedBox(height:10),
                    Container(
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                      child:
                      TextField(controller: Passwordcontroller,
                          onSubmitted: (text) {
                            setState(() {
                              Password = Passwordcontroller.text;
                            });
                          },
                          decoration: InputDecoration(
                            labelText: ' Password',
                          )
                      )), //in// utFile(label: "Password", obscureText: true)
                    ],
                  ),
                ),

                //Password textfield
                Padding(padding: EdgeInsets.symmetric(horizontal: 40),
                  child: Container(
                    padding: EdgeInsets.only(top: 3, left: 3),
                    decoration:
                    BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                    ),
                    child: MaterialButton(
                        minWidth: double.infinity,
                        height: 60,
                        onPressed: () {
                          postData();
                        },
                        color: Color(0xff9e8cb6),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center( child: Text(
                          "Take Me To The Fight!", style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: Colors.white,
                        ),
                        ))
                    ),
                  ),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                      Text("New to Fight or Flight?", style: TextStyle(color: Colors.white,
                        fontWeight: FontWeight.w300,
                        fontSize: 14)),
                    InkWell(
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(
                          builder: (context) => RegistrationPage()));
                    },
                        child:
                    Text("Register Now!", style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                      fontSize: 18,
                    ))),
                    InkWell(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(
                              builder: (context) => PasswordPage()));
                        },
                        child:

                        Text("Forgot your password?", style: TextStyle(
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
