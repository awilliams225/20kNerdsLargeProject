
import 'package:fightorflightandroid/main.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/forum.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
//import 'package:fightorflightandroid/provider.dart';


TextEditingController usernameController = TextEditingController();
TextEditingController passwordController = TextEditingController();
TextEditingController emailController = TextEditingController();
String username = '';

Future<void> changeUsername(String userId, context, String username) async {
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/changeUsername'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'userId': userId,
      'newUsername': usernameController.text
    }),
  );
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
    //  userProvider.setUsername = jsonMap['newUsername'];
    // Navigator.pop(context);
    //Navigator.push(context, MaterialPageRoute(builder: (context) => ProfilePage(userId: userId, username: username)));
  } else {
    print("Username wasn't changed. Please try again.");
  }
}

Future<void> changePassword(String userId) async {
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/changePassword'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'userId': userId,
      'newPassword': passwordController.text,
    }),
  );
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
    print("password changed");
  } else {
    // The request failed or the response is not a 200 Created status.
    print("Password not changed. Please try again.");
  }
}

Future<void> changeEmail(String userId) async {
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/changeEmail'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'userId': userId,
      'email': emailController.text,
    }),
  );
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
    print("email changed");
  } else {
    // The request failed or the response is not a 200 Created status.
    print("Email not changed. Please try again.");
  }
}

class ProfilePage extends StatefulWidget {
  final String userId;
  final String username;
  ProfilePage({required this.userId, required this.username});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late String userId;
  late String username;
  String get username1 => widget.username;
  String get userId1 => widget.userId;

  @override
  void initState() {
    super.initState();
    userId = widget.userId;
    username = widget.username;
  }

  void _refreshPage() {
    setState(() {
    });
  }

  @override
  Widget build(BuildContext context) {
    usernameController.clear();
    passwordController.clear();
    emailController.clear();
    // var userProvider = Provider.of<UserProvider>(context);
    // String username3 = userProvider.username;
    return Scaffold(
      backgroundColor: Color(0xff8c3f98),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Color(0xff8c3f98),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context, true);
          },
          icon: Icon(Icons.arrow_back_ios, size: 25, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(child:Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Profile',textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            //SizedBox(height: 20),
            //Icon(Icons.account_circle, size: 50, color: Colors.white),
            SizedBox(height: 20),
            Container(
                decoration: BoxDecoration(
                  color: Color(0xff063093),
                  borderRadius: BorderRadius.circular(16.0), // Adjust the radius as needed
                ),
                margin: EdgeInsets.only(left:50, right:50, top:10, bottom:10),
                padding: EdgeInsets.only(top:10, bottom:5, right:20, left:20),
                height:50,
                child:
            Text('Hi $username1!', textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 20, color: Colors.white))),
            SizedBox(height: 30),
            Text(
              'Update Login Credentials', textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color:Colors.white),
            ),
            SizedBox(height:20),
            Container(
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                child:
                TextField(
                  controller: usernameController,
                  decoration: const InputDecoration(
                    hintText: 'New Username',
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
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    hintText: 'New Email',
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
            TextField(
              controller: passwordController,
              decoration: const InputDecoration(
                hintText: 'New Password',
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.transparent),
                ),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.transparent),
                ),
              ),
            )),
            SizedBox(height: 10),
            Container(
              margin: EdgeInsets.only(left:50, right:50, top:10, bottom:10),
              padding: EdgeInsets.only(top:10, bottom:5, right:20, left:20),
              child:
            ElevatedButton(
              style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all<Color>(Color(0xff063093)),
                  shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0), // Set your desired BorderRadius
                    ),
                  )),
              onPressed: () {
                if(usernameController.text != ''){
                  changeUsername(userId1, context, username);
                 /* usernameController.clear();
                  passwordController.clear();
                  emailController.clear();*/
                  //  userProvider.updateUser(userId1, usernameController.text);
                }
                if(passwordController.text != ''){
                  changePassword(userId1);
                }
                if(emailController.text != ''){
                  changeEmail(userId1);
                }
                print(username);
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (context) => ProfilePage(userId: userId, username: usernameController.text)));

              },
              child: Text('Save Changes', style: GoogleFonts.outfit(fontSize:18),
            ))),
            Container(
                margin: EdgeInsets.only(left:50, right:50, top:10, bottom:10),
                padding: EdgeInsets.only(top:10, bottom:5, right:20, left:20),
                child:
                ElevatedButton(
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(Color(0xff82000D)),
                        shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0), // Set your desired BorderRadius
                          ))),
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(context, MaterialPageRoute(builder: (context) => HomePage()));
                    },
                    child: Text('Logout', style: GoogleFonts.outfit(fontSize:18),
                    ))),
          ],
        ),
      )),
    );
  }
}
