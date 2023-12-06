import 'package:fightorflightandroid/addpage.dart';
import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/questioncomments.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

Future<List<PostInfo>> printSlug(String slugtoforum, String selectedGameMode, int? response1) async{
  print("inside forum printing, selectedGameMode is ${selectedGameMode}");
  print("inside forum printing, slugtoforum is ${slugtoforum}");
  print("inside forum printing, response is ${response1}");
  final response = await http.post(
    Uri.parse(
        'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/getPosts'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, dynamic>{
      'questionSlug': slugtoforum,
      'stance': selectedGameMode,
      'response': response1,
    }),
  );
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  if (response.statusCode == 200) {
    List<dynamic> postList = jsonDecode(response.body)['postList'];
    print(response.body);
    List<PostInfo> postInfoList = postList.map((post) {
      return PostInfo(
        title: post['Title'] as String,
        content: post['Content'] as String,
        slug: post['Slug'] as String,
        userId: post['UserId'] as String,
        id: post['_id'] as String,
        timestamp: post['Timestamp'] as String,
        username: post['Username'] as String,
      );
    }).toList();
    return postInfoList;
  } else {
    throw Exception('Failed to load posts');
  }
}

class PostInfo {
  final String? title;
  final String? slug;
  final String? content;
  final String? userId;
  final String? id;
  final String? timestamp;
  final String? username;

  PostInfo({
    required this.title,
    required this.slug,
    required this.content,
    required this.userId,
    required this.id,
    required this.timestamp,
    required this.username
  });

  // Named constructor to initialize from JSON
  PostInfo.fromJson(Map<String, dynamic> json)
      : title = json['Title'] as String? ?? '',
        content = json['Content'] as String? ?? '',
        slug = json['Slug'] as String? ?? '',
        userId = json['UserId'] as String? ?? '',
        id = json['_id'] as String? ?? '',
        timestamp = json['Timestamp'] as String? ?? '',
        username = json['Username'] as String? ?? '';

  // This factory method is used to create a PostInfo instance from a list of posts
  static List<PostInfo> fromJsonList(List<dynamic> postList) {
    return postList.map((post) => PostInfo.fromJson(post)).toList();
  }
}


class ForumPage extends StatefulWidget {
  final String slugtoforum;
  final String? content = '';
  final String? timestamp = '';
  final int? receivedInt;
  //final String? username = '';
  final String selectedGameMode;
  final String selectionString;
  final String username;
  final String userId;
  final String answerId;
  final String? title = '';
  String get answerident => answerId;
  String get slugtoforum1 => slugtoforum;
  String get username1 => username;
  String get userId1 => userId;
  String get selectedGameMode1 => selectedGameMode;
  String get selectionString1 => selectionString;

  ForumPage({required this.slugtoforum, required this.selectedGameMode, this.receivedInt, required this.answerId, required this.userId, required this.username, required this.selectionString});
  @override
  _ForumPageState createState() => _ForumPageState();
}


class _ForumPageState extends State<ForumPage>  {
  late int? receivedInt2;
  Future<List<PostInfo>>? futureAlbum;

  @override
  void initState() {
    super.initState();
    receivedInt2 = widget.receivedInt;
    futureAlbum =  printSlug(widget.slugtoforum, widget.selectedGameMode, receivedInt2);
   // selectedColors = (selection == GameMode.fightMode) ? AppColorSchemes.fightModeColors : AppColorSchemes.flightModeColors;
  }

  /*
  void _refreshPage() {
    setState(() {
      Navigator.pop(context);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ForumPage(
              slugtoforum: widget.slugtoforum1,
              selectedGameMode: widget.selectedGameMode1,
              receivedInt: receivedInt2,
              answerId: widget.answerident,
              userId: widget.userId1,
              username: widget.username1,
              selectionString: widget.selectionString1
          ),
        ),
      );
    });
  }*/

  @override
  Widget build(BuildContext context) {
   return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {//async{
         // final result = await
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context)  => AddPostPage(slugtoforum: widget.slugtoforum1, selectedGameMode: widget.selectedGameMode1, answerId: widget.answerident, userId: widget.userId, username:widget.username),
            ),
          );
        },
        child: Icon(Icons.add),
        backgroundColor: widget.selectedGameMode == 'fight' ?  Color(0xff82000D): Color(0xff063093),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      resizeToAvoidBottomInset: false,
      backgroundColor: widget.selectedGameMode == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),
     appBar:
     PreferredSize(preferredSize: Size.fromHeight(65.0),
         child: AppBar(
           backgroundColor: widget.selectedGameMode == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),
           actions: [
             IconButton(
               onPressed:  (){
         Navigator.pop(context);
       Navigator.push(
       context,
       MaterialPageRoute(
         builder: (context) => ForumPage(
             slugtoforum: widget.slugtoforum1,
             selectedGameMode: widget.selectedGameMode1,
             receivedInt: receivedInt2,
             answerId: widget.answerident,
             userId: widget.userId1,
             username: widget.username1,
             selectionString: widget.selectionString1
         ),
       ),
     );},
               icon: Icon(Icons.refresh, size: 30,),
             ),
           ],
           elevation: 0,
           leading: IconButton(
             onPressed: () {
               Navigator.pop(context);
             },
             icon: Icon(Icons.arrow_back_ios, size: 25, color: Colors.white),
           ),
         )),
      body: Column(children:[Align(
          alignment: Alignment.center,
          child: Wrap(alignment: WrapAlignment.center,
              children: [
                Container(
                    padding: EdgeInsets.only(top:10, bottom:10, right:20, left:20),
                    height:50,
                    decoration: BoxDecoration(
                      color: widget.selectedGameMode == 'fight' ?  Color(0xff82000D): Color(0xff063093),
                      borderRadius: BorderRadius.circular(16.0), // Adjust the radius as needed
                    ),
                    child:
                    Text(textAlign: TextAlign.center,  style: GoogleFonts.outfit(color: Colors.white, fontSize: 20), '${widget.selectionString}'))])),
    SingleChildScrollView(
    child:
    FutureBuilder<List<PostInfo>>(
        future: futureAlbum,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // If the Future is still running, you can return a loading indicator
            return CircularProgressIndicator();
          }
    else if (snapshot.hasError) {
    print(snapshot.error);
    print("error");
    return Center(
    child: Text('Error: ${snapshot.error}'),
    );
    }
    else if (!snapshot.hasData || snapshot.data!.isEmpty) {
    return Center(
    child: Column(children:[
    SizedBox(height: 60),
    Text('No Posts Available',  style: GoogleFonts.outfit(fontSize: 20, color: Colors.white))]),
    );
    }
    else{
            List<PostInfo> postInfoList = snapshot.data!;
            print(postInfoList);
            return Column(children:[
              SizedBox(height:20),
              SingleChildScrollView(
                child: Column(
                  children: [
                    Container(
                    height: MediaQuery.of(context).size.height/1.3,
                child: ListView.builder(
              itemCount: postInfoList.length,
               itemBuilder: (context, index) {
                 print(postInfoList[index].slug);
                 DateTime timestamp = DateTime.parse(postInfoList[index].timestamp ?? 'unable to retrieve timestamp').toLocal();
                 String formattedDateTime = DateFormat('MM-dd-yyyy', 'en_US').format(timestamp);
                 String minutes = DateFormat('hh:mm a', 'en_US').format(timestamp);
                return
                  MaterialButton(
                    minWidth: double.infinity,
                    height: MediaQuery.of(context).size.height / 10,
                 onPressed: () {
                 Navigator.push(
                 context,
                 MaterialPageRoute(
                 builder: (context) =>
                 QuestionCommentsPage(slugtoforum: postInfoList[index].slug ?? 'slug not found', content: postInfoList[index].content, timestamp: postInfoList[index].timestamp, username: postInfoList[index].username, title: postInfoList[index].title, userId: widget.userId, stance: widget.selectedGameMode),
                 ));
                 },
                 elevation: 0,
                 shape: RoundedRectangleBorder(
                 borderRadius: BorderRadius.circular(
                 10),
                 ), child:
                  Container(
                    padding: EdgeInsets.all(15),
                    margin: EdgeInsets.only(bottom: 10, top: 10, right: 10, left: 20),
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
                                  color: Colors.white,
                                  child: Icon(Icons.account_circle, size: 60, color: widget.selectedGameMode == 'fight' ?  Color(0xffD90429): Color(0xff5679B6)), // Or use an Image widget
                                ),
                                SizedBox(height: 30),
                                Container(
                                  padding: EdgeInsets.all(5),
                                  margin: EdgeInsets.only(),
                                  child:
                                  Column(children:[
                                    Wrap(children:[
                                      Text(
                                        postInfoList[index].username ?? 'no username',
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
                                            color: Colors.grey,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Wrap(
                                      children: [
                                        Text(
                                          minutes,
                                          style: TextStyle(
                                            color: Colors.grey,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ]),
                                ),]),
                          SizedBox(width: 30),
                          Expanded( // Wrap the content in an Expanded widget to allow it to take the remaining space
                            child: Container(
                              margin: EdgeInsets.only(top: 10),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Wrap(
                                      children:[
                                        Text(
                                          postInfoList[index].title ?? 'no title',
                                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w600),
                                        ),
                                      ]
                                  ),
                                  SizedBox(height: 15),
                                  SingleChildScrollView(
                                      child:
                                      Wrap(
                                        children: [
                                          Text(
                                            postInfoList[index].content ?? 'no content',
                                            style: TextStyle(fontSize: 15),
                                          ),
                                        ],
                                      )),
                                ],
                              ),
                            ),
                          ),
                        ]
                    ),
                  ));
                },
            ))]))]);
        }},
      ),)]),
    );
  }
}