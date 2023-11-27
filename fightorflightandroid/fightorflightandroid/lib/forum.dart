import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/questioncomments.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

//TextEditingController slugcontroller = TextEditingController();
List<String> stringList = [];

class PostInfo {
  final String title;
  final String slug;
  final String content;
  PostInfo(this.title, this.slug, this.content);
}

class ForumPage extends StatefulWidget {
  final String slugtoforum;
  final String selectedGameMode;
  final String response;
  ForumPage({required this.slugtoforum, required this.selectedGameMode, required this.response});
  @override
  _ForumPageState createState() => _ForumPageState();
}

class _ForumPageState extends State<ForumPage> {
  List<PostInfo> postInfoList = [];
 // String slugtoforum = '';
 // String get slugtoforum1 => slugtoforum;

  Future<List<PostInfo>> printSlug() async {
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/getPosts'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'questionSlug': widget.slugtoforum,
        'stance': widget.selectedGameMode,
        'response': widget.response,
      }),
    );
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (response.statusCode == 200) {
      List<dynamic> posts = jsonMap['postList'];
      for (int i = 0; i < posts.length; i++) {
        if (posts[i]['Title'] != null && posts[i]['Slug'] != null) {
          String title = posts[i]['Title'];
          String slug = posts[i]['Slug'];
          String content = posts[i]['Content'];
          print(title);
          print(content);
          print(slug);
        //  titleList.add(title);
        //  slugList.add(slug);
          postInfoList.add(PostInfo(title, slug, content));
        }
      }
      return postInfoList;
    } else {
      return postInfoList;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor:  Color(0xff8545D7),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
      ),
      body: FutureBuilder<List<PostInfo>>(
        future: printSlug(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
           // List<String> titleList = snapshot.data ?? [];

            return ListView(
              children: [
                Container(
                  height: MediaQuery.of(context).size.height,
                  width: double.infinity,
                  decoration: BoxDecoration(color: Color(0xff8545D7)),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            Column(
                              children: <Widget>[
                                Container(
                                  margin: const EdgeInsets.only(
                                    left: 20.0,
                                    right: 20.0,
                                  ),
                                  child: Column(
                                    children: [
                                      for (int i = 0; i < postInfoList.length; i++)
                                  //  String title = titleList[i];
                                   // String slug = slugList[i];
                                    MaterialButton(
                                    minWidth: double.infinity,
                                    height: MediaQuery.of(context).size.height / 10,
                                   /* onPressed: () {
                                    Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                    builder: (context) =>
                                   // QuestionCommentsPage(),
                                    ),
                                    );
                                    },*/
                                    color: Color(0xff9e8cb6),
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(
                                    50),
                                    ),
                                    onPressed: () {  },
                                    child: Center(
                                    child: Text(
                                 postInfoList[i].title,
                                    style: TextStyle(fontSize: 16,
                                    color: Colors.black),
                                    ),
                                    ),
                                    ),
                                    SizedBox(height:10),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}'),
            );
          } else {
            // Return a loading indicator or some other widget
            return Center(
              child: CircularProgressIndicator(),
            );
          }
        },
      ),
    );
  }
}