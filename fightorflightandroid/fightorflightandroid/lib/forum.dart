import 'package:fightorflightandroid/loggedin.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

//TextEditingController slugcontroller = TextEditingController();

class ForumPage extends StatefulWidget {
  final String slugtoforum;
  ForumPage({required this.slugtoforum});
  @override
  _ForumPageState createState() => _ForumPageState();
}

class _ForumPageState extends State<ForumPage> {
  Future<void> printSlug() async {
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
    print(widget.slugtoforum);
    if (response.statusCode == 200) {
      List<dynamic> posts = jsonMap['postList'];
      int i = 0;
      while(posts[i]['Title'] != null){
        String title = posts[i]['Title'];
        i++;
        //return each title, have it print one at a time
        print(title);}
    //  return post.fromJson(jsonMap['postList']);
    } else {
      print("Failed.");
    }
  }

  @override
  Widget build(BuildContext context) {
    printSlug();
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
                                  Text(widget.slugtoforum),
                               /* child:
                                FutureBuilder<Album>(
                                  future: futureAlbum,
                                  builder: (context, snapshot) {
                                    if (snapshot.hasData) {
                                      return Text(snapshot.data!.text);
                                    } else if (snapshot.hasError) {
                                      return Text('${snapshot.error}');
                                    }
                                    // By default, show a loading spinner.
                                    return const CircularProgressIndicator();
                                  },
                                ),*/
                              ),
                            ])]))])));
  }
}