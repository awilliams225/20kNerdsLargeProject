import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
TextEditingController passController = TextEditingController();
bool validornot = false;

class PasswordPage extends StatefulWidget {
  @override
  _PasswordPageState createState() => _PasswordPageState();
}

class _PasswordPageState extends State<PasswordPage> {
  Future<void> sendEmail() async {
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/forgotPassword'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': passController.text,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (response.statusCode == 201) {
      print("in here");
    } else {
      // The request failed or the response is not a 200 Created status.
      print("response was not 200 inside sendEmail");
    }
  }

  Future<void> checkforvalidemail() async {
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/getUserByEmail'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': passController.text,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (jsonMap['id'] != -1) {
      print(jsonMap);
      validornot = true;
      sendEmail();
    } else {
      // The request failed
      print("Not a valid email.");
    }
  }

  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Color(0xffC80202),
        body: Container(
            margin: EdgeInsets.only(left: 30, right: 30, top: 80, bottom: 80),
            height: MediaQuery
                .of(context)
                .size
                .height,
            width: double.infinity / 2,
            decoration: BoxDecoration(color: Color(0xff8545D7),
                borderRadius: BorderRadius.circular(20)),
            child:  Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                     /*   IconButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.black),
                          ),*/
                          Text("To update your password, please verify your email.",
                              style: TextStyle(fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white)),
                                  Container(
                                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                                      child:
                                      TextField(controller: passController,
                                          onSubmitted: (text) {
                                            setState(() {
                                              Email = passController.text;
                                            });
                                          },
                                          decoration: InputDecoration(
                                            labelText: 'Enter your email',
                                          ))
                                  ),
                      MaterialButton(
                        minWidth: double.infinity,
                        height: 60,
                        onPressed: () {
                          checkforvalidemail();
                        },
                        color: Color(0xff9e8cb6),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center(child: Text(
                          "Send Verification", style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: Colors.white,
                        )))),

                  MaterialButton(
                      minWidth: double.infinity,
                      height: 60,
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => LoginPage()));
                      },
                      color: Color(0xff9e8cb6),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Center(child: Text(
                          "Take me to the fight!", style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: Colors.white,
                      )))),

                      ])));
  }
}