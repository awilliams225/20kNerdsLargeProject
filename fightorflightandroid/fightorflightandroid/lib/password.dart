import 'package:fightorflightandroid/profile.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:google_fonts/google_fonts.dart';

TextEditingController emailController = TextEditingController();
bool validornot = false;

class Popup1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(textAlign: TextAlign.center,'Email is not registered!'),
      content: Text(whatswrongwithpass, textAlign: TextAlign.center),
      actions: [
        TextButton(
          onPressed: () {
            // Close the popup when the "X" button is pressed
            Navigator.of(context).pop();
            whatswrongwithpass = '';
          },
          child: Text('Close'),
        ),
      ],
    );
  }
}

class Popup2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(textAlign: TextAlign.center,'Email was sent!'),
      content: Text(whatswrongwithpass, textAlign: TextAlign.center),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            whatswrongwithpass = '';
          },
          child: Text('Close'),
        ),
      ],
    );
  }
}

class PasswordPage extends StatefulWidget {
  @override
  _PasswordPageState createState() => _PasswordPageState();
}

class _PasswordPageState extends State<PasswordPage> {
  Future<void> getUser() async {
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/getUserByEmail'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': emailController.text,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (response.statusCode == 200) {
      String userId = jsonMap['id'];
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return Popup2();
        },
      );
      print("in here");
        sendEmail(userId);
    } else {
      // The request failed or the response is not a 200 Created status.
      print("This email is not registered.");
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return Popup1();
        },
      );
    }
  }

  Future<void> sendEmail(String userId) async {
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/forgotPassword'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'userId': userId,
        'email': emailController.text,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (response.statusCode == 201) {
      print("Email Sent");
      emailController.clear();
    } else {
      // The request failed or the response is not a 200 Created status.
      print("response was not 200 inside sendEmail");
    }
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor:  Color(0xff304E94),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back_ios, size: 25, color: Colors.white),
        ),
      ),
      resizeToAvoidBottomInset: false,
      backgroundColor: Color(0xff304E94),
      body: Container(
        margin: EdgeInsets.only(left: 50, right: 50, top: 20, bottom: 80),
        height: MediaQuery.of(context).size.height,
        width: double.infinity/2,
        decoration: BoxDecoration(color: Color(0xffD90429), borderRadius: BorderRadius.circular(20)),
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
                          Text("Forgot Password?",
                              style: GoogleFonts.outfit(
                                  fontSize: 30,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white))]),
                    SizedBox(height: 30),
                Text("Verify Your Email", style: GoogleFonts.outfit(
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                  fontSize: 18,
                ))
                  ],
                ),
                //Username textfield
                Padding(
                    padding: EdgeInsets.symmetric(horizontal: 40),
                    child: Column(
                        children: <Widget>[
                          Column(children: <Widget>[
                    Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                  child:
                            TextField(controller: emailController,
                                onSubmitted: (text) {
                                  setState(() {
                                    Email = emailController.text;
                                  });
                                  getUser();
                                },
                              decoration: const InputDecoration(
                                hintText: 'Enter Email',
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.transparent),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.transparent),
                                ),
                              ),
                            )
                          )]),]
                    )),

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
                         // postData();
                        },
                        color: Color(0xff304E94),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center( child: Text(
                          "Send Verification Email", style: GoogleFonts.outfit(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: Colors.white,
                        ),
                        ))
                    ),
                  ),
                ),
              ],
            ))
          ],
        ),
      ),
    );
  }
}