import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/forum.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class QuestionCommentsPage extends StatefulWidget {
  final String title;
  final String slugtoforum;
  QuestionCommentsPage(this.title, {required this.slugtoforum});
  @override
  _QuestionCommentsPageState createState() => _QuestionCommentsPageState();
}

class _QuestionCommentsPageState extends State<QuestionCommentsPage> {
  String title = '';
  String get title1 => title;
  List<String> contentList = [];
  Future<List<String>> printSlug() async {
    // print('${slugcontroller.text}');
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/getPosts'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'questionSlug': "cats_or_dogs",//widget.slugtoforum,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);

    if (response.statusCode == 200) {
      List<dynamic> posts = jsonMap['postList'];
      for (int i = 0; i < posts.length; i++) {
        if (posts[i]['Content'] != null) {
          String content = posts[i]['Content'];
          print(content);
          contentList.add(content);
        }
      }
      return contentList;
      // return post.fromJson(jsonMap['postList']);
    } else {
      return contentList;
    }
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
        body: FutureBuilder<List<String>>(
            future: printSlug(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                return Column(children: [
                  Container(
                      height: MediaQuery.of(context).size.height/2,
                      width: double.infinity,
                      decoration: BoxDecoration(color: Color(0xff817D8E)),
                      child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Expanded(child: Column(
                                mainAxisAlignment: MainAxisAlignment
                                    .spaceEvenly,
                                children: <Widget>[
                                  Column(
                                      children: <Widget>[
                                        Container(
                                          margin: const EdgeInsets.only(
                                              left: 20.0, right: 20.0),
                                          child:
                                          Column(
                                              children: [
                                                for (String content in contentList)
                                                  Text(
                                                    title,
                                                    style: TextStyle(
                                                        fontSize: 16, color: Colors.black),
                                                  ),
                                              ]),
                                        )
                                      ])
                                ]))
                          ]))
                ]);
              }
              else if (snapshot.hasError){
                return Center(
                  child: Text('Error: ${snapshot.error}'),
                );
              }
              else {
                // Return a loading indicator or some other widget
                return Center(
                  child: CircularProgressIndicator(),
                );
              }
            }));
  }
}