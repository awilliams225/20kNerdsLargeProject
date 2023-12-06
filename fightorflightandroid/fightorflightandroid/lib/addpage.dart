import 'package:fightorflightandroid/loggedin.dart';
import 'package:fightorflightandroid/forum.dart';
import 'package:flutter/material.dart';
import 'package:slugify/slugify.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';

TextEditingController Titlecontroller = TextEditingController();
TextEditingController Contentcontroller = TextEditingController();
String Title = ''; // Add this line
String Content = ''; // Add



class MyPopup1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Color(0xff8c3f98),
     content: Padding(
        padding: EdgeInsets.only(top:16.0),
        child: Text('Your Post Was Added!', textAlign: TextAlign.center),
      ),
      titleTextStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 20), // Customize title text color
      contentTextStyle: GoogleFonts.outfit(color: Colors.white),
  //    title: Text(textAlign: TextAlign.center, ''),
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


class AddPostPage extends StatefulWidget {
  final String slugtoforum;
  final String selectedGameMode;
  final String answerId;
  final String userId;
  final String username;
  var titleslug;
  late int response;
  String get slugtoforum1 => slugtoforum;
  String get selectedGameMode1 => selectedGameMode;
  AddPostPage({required this.slugtoforum, required this.selectedGameMode, required this.answerId, required this.userId, required this.username});
  @override
  _AddPostPageState createState() => _AddPostPageState();
}

class _AddPostPageState extends State<AddPostPage> {
  Future<void> addanewpost(String userId, String slugtoforum, String answerId, String username) async {
    var titleslug = slugify(Titlecontroller.text);
    print(username);
    final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/addPost'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'title': Titlecontroller.text,
        'content': Contentcontroller.text,
        'slug': titleslug,
        'userId': userId,
        'questionSlug': slugtoforum,
        'answerId': answerId,
      }),
    );
    print(userId);
    print(answerId);
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    print(widget.answerId);
    if (response.statusCode == 200) {
      /*
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return MyPopup1();
        },
      );*/
      Titlecontroller.clear();
      Contentcontroller.clear();
      Navigator.pop(context);
    } else {
      // The request failed or the response is not a 200 Created status.
      print("Post not created");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor:  widget.selectedGameMode1 == 'fight' ?  Color(0xff82000D): Color(0xff063093),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back_ios, size: 25, color: Colors.white),
        ),
      ),
      resizeToAvoidBottomInset: false,
      backgroundColor: widget.selectedGameMode1 == 'fight' ?  Color(0xff82000D): Color(0xff063093),
      body: Container(
        margin: EdgeInsets.only(left: 50, right: 50, top: 20, bottom: 80),
        height: MediaQuery
            .of(context)
            .size
            .height,
        width: double.infinity / 2,
        decoration: BoxDecoration(
            color:  widget.selectedGameMode1 == 'fight' ?  Color(0xffD90429): Color(0xff5679B6),
            borderRadius: BorderRadius.circular(20)),
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
                        children: [
                          Text("Add a Post!",
                              style: GoogleFonts.outfit(fontSize: 30,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white))
                        ]),
                    SizedBox(height: 0)
                  ],
                ),

                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    children: <Widget>[
                      Container(
                          decoration: BoxDecoration(color: Colors.white,
                              borderRadius: BorderRadius.circular(10)),
                          child:
                          TextField(controller: Titlecontroller,
                              onSubmitted: (text) {
                                setState(() {
                                  Title = Titlecontroller.text;
                                });
                              },
                            decoration: const InputDecoration(
                              hintText: 'Add a Fun Title!',
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.transparent),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.transparent),
                              ),
                            ),
                          )
                      ),
                      SizedBox(height: 10),
                      Container(
                        height:150,
                          decoration: BoxDecoration(color: Colors.white,
                              borderRadius: BorderRadius.circular(10)),
                          child:
                          TextField(controller: Contentcontroller,
                            maxLines: null,
                              onSubmitted: (text) {
                                setState(() {
                                  Content = Contentcontroller.text;
                                });
                              },
                            decoration: const InputDecoration(
                              hintText: 'Thoughts...',
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
                          if(Titlecontroller.text != ''){
                            if(Contentcontroller.text != ''){
                              addanewpost(widget.userId, widget.slugtoforum,widget.answerId, widget.username);}
                        }},
                        color: widget.selectedGameMode1 == 'fight' ?  Color(0xff82000D): Color(0xff063093),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Center(child: Text(textAlign: TextAlign.center,
                          "Take Me To The Fight!", style:GoogleFonts.outfit(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: Colors.white,
                        ),
                        ))
                    ),
                  ),
                ),
              ],
            ))
          ],
        ),
      ),
    );
  }
}