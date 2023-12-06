import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/forum.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:slugify/slugify.dart';
import 'package:markdown/markdown.dart' as md;
import 'package:google_fonts/google_fonts.dart';

TextEditingController ReplyTextController = TextEditingController();


Future<void> sendReply(String postSlug,String userId, context) async {
  print(slugify(ReplyTextController.text));
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/addReply'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'userId': userId,
      'text': ReplyTextController.text,
      'slug': postSlug,
      'response': '',
    }),
  );
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
  } else {
    // The request failed or the response is not a 200 Created status.
    print("Reply not added");
  }
}

Future<List<ReplyInfo>> printReplies(String slugtoforum) async {
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/replies/getByPostSlug'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, dynamic>{
      'slug': slugtoforum,
    }),
  );
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
    print("200");
    List<dynamic> replyList = jsonDecode(response.body)['replyList'];
    print(response.body);
    List<ReplyInfo> replyInfoList = replyList.map((reply) {
      return ReplyInfo(
        username: reply['username'] as String,
        text: reply['text'] as String,
        timestamp: reply['timestamp'] as String
      );
    }).toList();
    return replyInfoList;
  } else {
    throw Exception('Failed to load replies.');
  }
}

class ReplyInfo {
  final String? text;
  final String? username;
  final String? timestamp;

  ReplyInfo({
    required this.text,
    required this.username,
    required this.timestamp,
  });

  // Named constructor to initialize from JSON
  ReplyInfo.fromJson(Map<String, dynamic> json)
      : text = json['text'] as String? ?? '',
        timestamp = json['timestamp'] as String? ?? '',
        username = json['username'] as String? ?? '';

  // This factory method is used to create a PostInfo instance from a list of posts
  static List<ReplyInfo> fromJsonList(List<dynamic> replyList) {
    return replyList.map((reply) => ReplyInfo.fromJson(reply)).toList();
  }
}

class QuestionCommentsPage extends StatefulWidget {

  final String? title;
  final String slugtoforum;
  final String? content;
  final String? username;
  final String? timestamp;
  final String userId;
  final String stance;
  late int selection = 0;
  String get userId1 => userId;
  String get stance1 => stance;
  //int get response => selection;

  QuestionCommentsPage(
   {required this.slugtoforum, required this.content, required this.timestamp, required this.username, required this.title, required this.userId, required this.stance});
  @override
  _QuestionCommentsPageState createState() => _QuestionCommentsPageState();

}

class _QuestionCommentsPageState extends State<QuestionCommentsPage> {
  late Future<List<ReplyInfo>> futureAlbum;

  //int get response => widget.response;
  @override
  void initState() {
    super.initState();
  }

  int counter = 0;

  void _refreshPage() {
    setState(() {
    });
  }

  @override
  Widget build(BuildContext context) {
    DateTime timestamp = DateTime.parse(widget.timestamp ?? 'unable to retrieve timestamp').toLocal();;
    String formattedDateTime = DateFormat('MM-dd-yyyy', 'en_US').format(timestamp);
    String minutes = DateFormat('hh:mm a', 'en_US').format(timestamp);

    String? contenttype = widget.content ?? 'no content';
    String contentText = Markdown(data: contenttype ?? 'No content').toString();
    print(contentText);

    return GestureDetector(
        onTap: () {
      FocusScope.of(context).requestFocus(FocusNode());
    },
    child:Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: widget.stance == 'fight' ?  Color(0xffD90429):Color(0xff5679B6),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: widget.stance == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back_ios, size: 25, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(child:Column(
        children: [
          Container(
            padding: EdgeInsets.only(left:10, right:15, top:10, bottom: 10),
            margin: EdgeInsets.only(bottom: 0, top: 10, right: 20, left: 30),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 5,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                //      padding: EdgeInsets.all(),
                      margin: EdgeInsets.only( right: 30),
                      width: 30,
                      height: 30,
                      color: Colors.white, // Replace with your profile picture
                      child: Icon(Icons.account_circle, size: 60, color: widget.stance == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),), // Or use an Image widget
                    ),
                    SizedBox(height: 30),
                    Container(
                      padding: EdgeInsets.all(5),
                      margin: EdgeInsets.only(),
                      child:
                        Column(children:[
                          Wrap(children:[
                    Text(
                      widget.username ?? 'no username',
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    )]),
                    SizedBox(height: 5),
                    Wrap(
                      children: [
                        Text(
                          formattedDateTime,
                          style: TextStyle(
                            color: Color(0xFF808080),
                          ),
                        ),
                      ],
                    ),
                    Wrap(
                      children: [
                        Text(
                          minutes,
                          style: TextStyle(
                            color: Color(0xFF808080),
                          ),
                        ),
                      ],
                    ),
                  ]),
                ),]),
                SizedBox(width: 30),
           Expanded( 
             child:
              Container(
                margin: EdgeInsets.only(top: 10),
                padding:EdgeInsets.only(right: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                      Wrap(
                        children:[
                          Text(
                            widget.title ?? 'no title',
                            style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w600),
                          ),
                        ]
                      ),
                      SizedBox(height: 15),
                      Wrap(
                        children: [
                          Text(
                            widget.content ?? 'no content',
                            style: TextStyle(fontSize: 15),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
            ),
      ]
            ),
          ),
          SizedBox(height: 12),

          FutureBuilder<List<ReplyInfo>>(
            future: futureAlbum,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                List<ReplyInfo> replyInfoList = snapshot.data!;
                if (replyInfoList.isNotEmpty) {
                  return Column(children:[
                    SizedBox(height:5),
                    SingleChildScrollView(
                        child: Column(
                            children: [
                              Container(
                               margin: EdgeInsets.only(left:15),
                            //    color: Colors.lightGreenAccent,
                                  height: MediaQuery.of(context).size.height/2 -
                                      MediaQuery.of(context).viewInsets.bottom,
                                  child: ListView.builder(                                    itemCount: replyInfoList.length,
                                    itemBuilder: (context, index) {
                                      DateTime timestamp2 = DateTime.parse(replyInfoList[index].timestamp ?? 'unable to retrieve timestamp').toLocal();;
                                      String formattedDateTime2 = DateFormat('MM-dd-yyyy', 'en_US').format(timestamp2);
                                      String minutes2 = DateFormat('hh:mm a', 'en_US').format(timestamp2);
                                      return
                                      Column(children:[
                                        Container(
                                          padding: EdgeInsets.all(15),
                                         margin: const EdgeInsets.only(
                                          left: 50.0,
                                          right: 30.0,
                                        ),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius: BorderRadius.circular(16),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.black.withOpacity(0.2),
                                                blurRadius: 5,
                                                offset: Offset(0, 3),
                                              ),
                                            ],
                                          ),
                                          child: Row(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                // Left Section: Profile Picture, Username, Timestamp
                                                Column(
                                                    crossAxisAlignment: CrossAxisAlignment.center,
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: [
                                                      Container(
                                                        //      padding: EdgeInsets.all(),
                                                        margin: EdgeInsets.only( right: 30),
                                                        width: 30,
                                                        height: 30,
                                                        color: Colors.white, // Replace with your profile picture
                                                        child: Icon(Icons.account_circle, size: 60, color: widget.stance == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),), // Or use an Image widget
                                                      ),
                                                      SizedBox(height: 30),
                                                      Container(
                                                        padding: EdgeInsets.all(5),
                                                        margin: EdgeInsets.only(),
                                                        child:
                                                        Column(children:[
                                                          Wrap(children:[
                                                            Text(
                                                              replyInfoList[index].username ?? 'no username',
                                                              style: GoogleFonts.outfit(
                                                                fontWeight: FontWeight.bold,
                                                                fontSize: 14,
                                                              ),
                                                            )]),
                                                          SizedBox(height: 5),
                                                          Wrap(
                                                            children: [
                                                              Text(
                                                                formattedDateTime2,
                                                                style: TextStyle(
                                                                  color: Color(0xFF808080),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          Wrap(
                                                            children: [
                                                              Text(
                                                                minutes2,
                                                                style: TextStyle(
                                                                  color: Color(0xFF808080),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ]),
                                                      ),]),
                                                SizedBox(width: 30),
                                                Expanded( 
                                                  child: Container(
                                                    margin: EdgeInsets.all(2),
                                                    child: Column(
                                                      crossAxisAlignment: CrossAxisAlignment.start,
                                                      children: [
                                                        Wrap(
                                                            children:[
                                                              Text(
                                                                replyInfoList[index].text ?? 'no title',
                                                                style: TextStyle(fontSize: 16),
                                                              ),
                                                            ]
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ),
                                              ]
                                          ),
                                        ),
                                      SizedBox(height:10)]);
                                        },
                                  ))]))]);
                } else {
                  return Column(
                    children:[
                      SizedBox(height:50),
                      Text(textAlign: TextAlign.center,'This post has no replies yet!', style: TextStyle(fontSize:18, color: Colors.white)),
                      SizedBox(height:10),
                      Text(textAlign: TextAlign.center,'Leave a reply to start the fight!', style: TextStyle(fontSize:18, color: Colors.white)),
                      SizedBox(height:80),
                    ],
                  );
                }
              } else if (snapshot.hasError) {
                print(snapshot.error);
                print("error");
                return Center(
                  child: Text('Error: ${snapshot.error}'),
                );
              } else {
                return Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
          ),
          SizedBox(height:32),
        ],
      )),
      bottomNavigationBar:
        Padding(
        padding: MediaQuery.of(context).viewInsets,
    child:
        SingleChildScrollView(
        child: Column(
    children: [
        Container(color: //Color(0xff8c3f98),
            widget.stance == 'fight' ?  Color(0xff82000D): Color(0xff063093),
        child:
      Padding(
        padding: const EdgeInsets.only(left: 10.0, bottom:10, top:10),
        child: Row(
          children: [
            Expanded(child:
              Container(
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
              child: TextField(
                controller: ReplyTextController,
                decoration: InputDecoration(
                  hintText: 'Reply something!',
                  border: OutlineInputBorder(),
                ),
              )),
            ),
            IconButton(
              icon: Icon(Icons.send, color: Colors.white),
              onPressed: () {
                sendReply(widget.slugtoforum, widget.userId, context);
                ReplyTextController.clear();
                _refreshPage();
              },
            ),
          ],
        ),
      ))])),
    )));
  }
}