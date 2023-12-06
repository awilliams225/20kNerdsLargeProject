import 'package:fightorflightandroid/loggedin.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:google_fonts/google_fonts.dart';

String userId = '';
String Username = '';
String Password = '';
String Email = '';
String whatswrongwithpass = '';
String errormessage = '';
bool passwordSymbol = false;
bool passwordUpper = false;
bool passwordLower = false;
bool passwordNum = false;
bool passwordLength = false;
TextEditingController Usernamecontroller = TextEditingController();
TextEditingController Passwordcontroller = TextEditingController();
TextEditingController Emailcontroller = TextEditingController();

class Popup1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Color(0xff8c3f98),
      content: Padding(
        padding: EdgeInsets.only(top:16.0),
          child: Text(whatswrongwithpass, textAlign: TextAlign.center),
      ),// Set the background color
      titleTextStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 20), // Customize title text color
      contentTextStyle: GoogleFonts.outfit(color: Colors.white),
      title: Text(textAlign: TextAlign.center, 'Password Not Valid!'),
      actions: [
        TextButton(
          onPressed: () {
            // Close the popup when the "X" button is pressed
            Navigator.of(context).pop();
            whatswrongwithpass = '';
          },
          child: Text('Close', style: GoogleFonts.outfit(color:Colors.white)),
        ),
      ],
    );
  }
}

class Popup2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Color(0xff8c3f98),
      content: Padding(
        padding: EdgeInsets.only(top:16.0), // Add padding here
      ),// Set the background color
      titleTextStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 20), // Customize title text color
      contentTextStyle: GoogleFonts.outfit(color: Colors.white),
      title: Text(textAlign: TextAlign.center, 'Email Verification Sent'),
      //content: Text(whatswrongwithpass, textAlign: TextAlign.center),
      actions: [
        TextButton(
          onPressed: () {
            // Close the popup when the "X" button is pressed
            Navigator.of(context).pop();
          },
          child: Text('Close', style: GoogleFonts.outfit(color:Colors.white)),
        ),
      ],
    );
  }
}

class RegisterErrorPopup extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Text(textAlign: TextAlign.center, errormessage),
      actions: [
        TextButton(
          onPressed: () {
            // Close the popup when the "X" button is pressed
            Navigator.of(context).pop();
            errormessage = '';
          },
          child: Text('Close'),
        ),
      ],
    );
  }
}

class RegistrationPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

  bool isPasswordValid(String password) {
  bool check2 = true;
    if (password.length < 8) {
      passwordLength = true;
      whatswrongwithpass = 'Your password must be at least 8 characters. ';
      check2 = false;
    }
    if (!password.contains(RegExp(r'[A-Z]'))) {
      passwordUpper = true;
      whatswrongwithpass += 'Your password must contain at least one uppercase letter. ';
      check2 = false;
    }
    if (!password.contains(RegExp(r'[a-z]'))) {
      passwordLower = true;
      whatswrongwithpass += 'Your password must contain at least one lowercase letter. ';
      check2 = false;
    }
    if (!password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
      whatswrongwithpass += 'Your password must contain at least one symbol. ';
      passwordSymbol = true;
      check2 = false;
    }
    return check2;
  }

Future<void> sendEmail({required String userId}) async {
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/registerWithEmail'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'userId': userId,
      'email': Emailcontroller.text,
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

Future<void> postData(context) async {
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
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    String userId = jsonMap['userId'];
    print(jsonMap);
    sendEmail(userId: userId);
    showDialog(
      context: context,
      builder: (BuildContext context) {
        postData(context);
        return Popup2();
      },
    );
    Usernamecontroller.clear();
    Passwordcontroller.clear();
    Emailcontroller.clear();
    Navigator.push(context, MaterialPageRoute(
        builder: (context) => LoginPage()));
  } else {
    if(Usernamecontroller.text.isEmpty){
      errormessage += 'Your username field is blank. ';
    }
    if(Emailcontroller.text.isEmpty){
      errormessage += 'Your email field is blank.';
    }
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return RegisterErrorPopup();
      },
    );
    // The request failed or the response is not a 201 Created status.
    print('Request failed with status: ${response.statusCode}');
  }
}

class _RegisterPageState extends State<RegistrationPage> {

  bool _obscureText = false;
  @override
  void initState() {
    _obscureText = false;
  }

  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Color(0xff304E94),
      appBar: PreferredSize(preferredSize: Size.fromHeight(60.0),
    child:AppBar(
        elevation: 0,
        backgroundColor:Color(0xff304E94),
        leading: IconButton(
          onPressed: () {
            Usernamecontroller.clear();
            Passwordcontroller.clear();
            Emailcontroller.clear();
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
      )),
      body: Container(
        margin: EdgeInsets.only(left: 50, right: 50, top: 20, bottom: 60),
        height: MediaQuery.of(context).size.height,
        width: double.infinity/2,
        decoration: BoxDecoration(color:  Color(0xffD90429), borderRadius: BorderRadius.circular(20)),
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
                          Text("Register",
                              style:  GoogleFonts.outfit(
                                  fontSize: 30,
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
                      Column(children: <Widget>[
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
                          )),
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
                            decoration:  InputDecoration(
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
                        SizedBox(height:10),
                    Container(
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                        child:
                        TextField(controller: Emailcontroller,
                            onSubmitted: (text) {
                              setState(() {
                                Email = Emailcontroller.text;
                              });
                            },
                          decoration: const InputDecoration(
                            hintText: 'Email',
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                          ),
                        )),
                      ],
                      ),]
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
                          bool check = isPasswordValid(Password);
                          if(check != true){
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return Popup1();
                              },
                            );
                          }
                          else{
                            postData(context);
                          }
                        },
                        color: Color(0xff304E94),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center(child: Text(textAlign: TextAlign.center,
                          "Take Me To The Fight!", style: GoogleFonts.outfit(
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
                    Text("Have an account?",
                        style: GoogleFonts.outfit(color: Colors.white, fontSize: 18)),
                    SizedBox(height:5),
                    InkWell(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(
                              builder: (context) => LoginPage()));
                        },
                        child:
                        Text("Login!", style: GoogleFonts.outfit(
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                          fontSize: 22,
                        ))),
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