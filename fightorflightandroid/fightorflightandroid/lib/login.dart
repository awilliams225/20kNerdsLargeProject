import 'package:fightorflightandroid/password.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/loggedin.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';

TextEditingController Usernamecontroller = TextEditingController();
TextEditingController Passwordcontroller = TextEditingController();
String error = '';

class Popup extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Color(0xff8c3f98),
      content: Padding(
        padding: EdgeInsets.only(top:16.0), 
      ),
      titleTextStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 20), 
      contentTextStyle: GoogleFonts.outfit(color: Colors.white),
      title: Text(textAlign: TextAlign.center, error),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            whatswrongwithpass = '';
          },
          child: Text('Close', style: GoogleFonts.outfit(color:Colors.white)),
        ),
      ],
    );
  }
}

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  Future<void> postData() async {
    String userId = '';
    String username = '';
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
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (jsonMap['id'] != -1) {
      String userident = jsonMap['id'];
      String username1 = Usernamecontroller.text;
      Usernamecontroller.clear();
      Passwordcontroller.clear();
      Navigator.push(context, MaterialPageRoute(builder: (context) => LoggedinPage(userId: userident, username: username1)));

    } else {
      error = jsonMap['error'];
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return Popup();
        },
      );
      Usernamecontroller.clear();
    }
  }
  bool _obscureText = false;

  @override
  void initState() {
    _obscureText = false;
  }

@override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Color(0xff304E94),
      appBar: AppBar(
        elevation: 0,
        backgroundColor:  Color(0xff304E94),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
      ),
      //Color(0xff5679B6),
      body: Container(
        margin: EdgeInsets.only(left: 50, right: 50, top: 30, bottom: 80),
        height: MediaQuery.of(context).size.height,
        width: double.infinity/2,
        decoration: BoxDecoration(color: //Color(0xff8545D7)
        Color(0xffD90429), borderRadius: BorderRadius.circular(20)),
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
                    Text("Login",
                        style: GoogleFonts.outfit(fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.white))]),
                    SizedBox(height: 20)
                  ],
                ),

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
                              decoration: const InputDecoration(
                                hintText: 'Username',
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(color: Colors.transparent),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(color: Colors.transparent),
                                  ),
                                ),
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
                        obscureText: !_obscureText,
                          decoration: InputDecoration(
                            hintText: 'Password',
                            suffixIcon: IconButton(
                              icon: Icon(_obscureText ? Icons.visibility : Icons.visibility_off),
                              onPressed: () {
                                setState(() {
                                  _obscureText = !_obscureText;
                                });
                              },
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                          ),
                      )),
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
                        color: Color(0xff304E94),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center(child: Text(textAlign: TextAlign.center,
                          "Take Me To The Fight!", style: GoogleFonts.outfit(
                          fontWeight: FontWeight.w600,
                          fontSize: 18,
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
                      Text("New to Fight or Flight?",  style: GoogleFonts.outfit(color: Colors.white,
                        fontWeight: FontWeight.w300,
                        fontSize: 14)),
                    SizedBox(height:10),
                    InkWell(
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(
                          builder: (context) => RegistrationPage()));
                    },
                        child:
                    Text("Register Now!", style: GoogleFonts.outfit(
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                      fontSize: 18,
                    ))),
                    SizedBox(height:10),
                    InkWell(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(
                              builder: (context) => PasswordPage()));
                        },
                        child:
                        Text("Forgot Password?", style: GoogleFonts.outfit(
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
