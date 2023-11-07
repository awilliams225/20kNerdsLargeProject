import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fightorflightandroid/forum.dart';

Future<Album> fetchAlbum() async {
  final response = await http.get(Uri.parse('https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/questions/getRandom'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    });
  if (response.statusCode == 200) {
    print("response returned");
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    return Album.fromJson(jsonMap['question']);
  } else {
    throw Exception('Failed to load album');
  }
}
class Album {
  final String text;
  final String slug;

  const Album({
    required this.text,
    required this.slug,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      slug: json['slug'] as String,
      text: json['text'] as String,
    );
  }
}

class LoggedinPage extends StatefulWidget {
  @override
  _LoggedinPageState createState() => _LoggedinPageState();
}

class _LoggedinPageState extends State<LoggedinPage> {
  String slugtoforum = '';
  String get slugtoforum1 => slugtoforum;
  late Future<Album> futureAlbum;

  @override
  void initState() {
    super.initState();
    futureAlbum = fetchAlbum();
  }

  @override
  Widget build(BuildContext context) {
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
                FutureBuilder<Album>
                  (
                  future: futureAlbum,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      slugtoforum = snapshot.data!.slug;
                      return Text(snapshot.data!.text);
                    } else if (snapshot.hasError) {
                      return Text('${snapshot.error}');
                    }
                    // By default, show a loading spinner.
                    return const CircularProgressIndicator();
                  },
                ),
          ),
                MaterialButton(
                    minWidth: double.infinity,
                    height: 60,
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(
                          builder: (context) => ForumPage(slugtoforum: slugtoforum1)));
                    },
                    color: Color(0xff0095FF),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50),
                    ),
                child:
                Text("Go to forum!")),
          ])]))])));
}
}