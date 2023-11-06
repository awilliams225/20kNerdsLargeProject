import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoggedinPage extends StatefulWidget {
  @override
  _LoggedinPageState createState() => _LoggedinPageState();
}

class Album {
  final String text;

  const Album({
    required this.text,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      text: json['text'] as String,
    );
  }
}

//TextEditingController Usernamecontroller = TextEditingController();
String hello = "";

class _LoggedinPageState extends State<LoggedinPage> {
  Future<Album> questionData() async {
    print("a");
    final response = await http.get(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/questions/getRandom'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      };
    );
    if (response.statusCode == 200) {
      // If the server did return a 200 OK response,
      // then parse the JSON.
      return Album.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load album');
    }
    //print("b");
  //  Map<String, dynamic> jsonMap = jsonDecode(response.body);
   // print("c");
   // print("Response is ${response.body}");
  //  hello = response.body;
  }

  Widget build(BuildContext context) {
    questionData();
    return Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.white,
        appBar: AppBar(
          elevation: 0,
          backgroundColor: Colors.white,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.black),
          ),
        ),
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
            Container(
          margin: const EdgeInsets.only(left: 20.0, right: 20.0),
                child:
                Text(hello, style: TextStyle(fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Colors.white))),
          SizedBox(height: 20)
          ])]))])));
}
}