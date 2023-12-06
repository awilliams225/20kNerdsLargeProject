import 'package:fightorflightandroid/profile.dart';
import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fightorflightandroid/forum.dart';
import 'package:provider/provider.dart';
//import 'package:fightorflightandroid/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:google_fonts/google_fonts.dart';

String answerId = '';
Future<Album> fetchAlbum() async {
  final response = await http.get(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/questions/getRandom'),
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
  final List<String> responses;
  final String id;

  const Album({
    required this.text,
    required this.slug,
    required this.responses,
    required this.id,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    List<String> responses = List<String>.from(json['responses'] ?? []);
    return Album(
      slug: json['slug'] as String,
      text: json['text'] as String,
      responses: responses,
      id: json['_id'] as String,
    );
  }
}

class GameMode {
  static const String fightMode = 'fight';
  static const String flightMode = 'flight';

  static Future<void> setGameMode(String mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('game_mode', mode);
  }

  static Future<String> getGameMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('game_mode') ?? fightMode; // Default to normal mode if not set
  }
}

class AppIcons {
  static const IconData fightModeIcon = Icons.sports_kabaddi;
  static const IconData flightModeIcon = Icons.paragliding;
}

class AppColorSchemes {
  static const fightModeColors = {
    'primaryColor': Color(0xff82000D),
    'backgroundColor': Color(0xffD90429),
  };

  static const flightModeColors = {
    'primaryColor': Color(0xff063093),
    'backgroundColor': Color(0xff5679B6),
  };
}

class LoggedinPage extends StatefulWidget {
  final String userId;
  final String username;
  LoggedinPage({required this.userId, required this.username});
  @override
  _LoggedinPageState createState() => _LoggedinPageState();
}

class _LoggedinPageState extends State<LoggedinPage> {
  Future<void> sendAnswer(String gameMode, int? receivedInt, String userId, String questionId, String slugtoforum1, String username1, String selectionString) async {
    final response = await http.post(
        Uri.parse(
            'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/answers/addAnswer'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, dynamic>{
          'response': receivedInt,
          'stance': gameMode,
          'questionId': questionId,
          'userId': userId,
        }));
    Map<String, dynamic> jsonMap = jsonDecode(response.body);
    if (response.statusCode == 200) {
      answerId = jsonMap['answerId'];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ForumPage(
            slugtoforum: slugtoforum1,
            selectedGameMode: gameMode,
             receivedInt: receivedInt,
            answerId: answerId,
            userId: userId,
            username: username1,
            selectionString: selectionString
          ),
        ),
      );
    } else {
      print("not working");
      throw Exception('Failed to load album');
    }
  }

  late Map<String, Color> selectedColors;
  late String userId;
  String questionId = '';
  String slugtoforum = '';
  String responsechoice = '';
  String answerident = '';
  String selectionstring = '';
  String get username1 => widget.username;
  int selectionTracker = 0;
  //int get response => selection;
  String get slugtoforum1 => slugtoforum;
  late String selectedGameMode;
  String get stance => selectedGameMode;
  late Future<Album> futureAlbum;
  bool selectionMade = false;

  @override
  void initState() {
    super.initState();
    userId = widget.userId;
    _loadGameMode();
    selectedGameMode = 'fight';
    selectedColors = {};
    futureAlbum = fetchAlbum();
  }

  Future<void> _loadGameMode() async {
    selectedGameMode = await GameMode.getGameMode();
    selectedColors = (selectedGameMode == GameMode.fightMode) ? AppColorSchemes.fightModeColors : AppColorSchemes.flightModeColors;
    setState(() {});
  }

  Future<void> _toggleGameMode() async {
    selectedGameMode = (selectedGameMode == GameMode.fightMode) ? GameMode.flightMode : GameMode.fightMode;
    await GameMode.setGameMode(selectedGameMode);
    selectedColors = (selectedGameMode == GameMode.fightMode) ? AppColorSchemes.fightModeColors : AppColorSchemes.flightModeColors;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    print(widget.username);
    double buttonElevation = 0.0;
    return Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: selectedColors['backgroundColor'],
        appBar:
        PreferredSize(preferredSize: Size.fromHeight(65.0),
        child: AppBar(
          actions: [
            IconButton(
              onPressed: _toggleGameMode,
              icon: Icon((selectedGameMode == GameMode.fightMode) ? AppIcons.fightModeIcon : AppIcons.flightModeIcon, size: 30,),
            ),
          ],
          elevation: 0,
          backgroundColor: selectedColors['backgroundColor'],
          leading: IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => ProfilePage(userId: userId, username: username1)));
            },
            icon: Icon(Icons.account_circle, size: 35, color: Colors.white),
          ),
        )),

        //Body begins
        body: Container(
          padding: EdgeInsets.only(right:5, left:5),
            height: MediaQuery.of(context).size.height,
            width: double.infinity,
            decoration: BoxDecoration(color: selectedColors['backgroundColor']),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Container(
                    margin: const EdgeInsets.only(left: 10.0, right: 10.0),
                    child: FutureBuilder<Album>(
                      future: futureAlbum,
                      builder: (context, snapshot) {
                        if (snapshot.hasData) {
                          slugtoforum = snapshot.data!.slug;

                          return Column(children: [
                            Container(
                                margin: EdgeInsets.only(
                                    left: 50, right: 50, bottom: 30),
                                height:
                                    MediaQuery.of(context).size.height / 2,
                                width: double.infinity / 2,
                                decoration: BoxDecoration(
                                    color: selectedColors['primaryColor'],
                                    borderRadius: BorderRadius.circular(20)),
                                child: Center(
                                    child: Text(
                                  snapshot.data!.text,
                                  textAlign: TextAlign.center,
                        style: GoogleFonts.outfit(
                                      color: Colors.white, fontSize: 25),
                                ))),
                          ]);
                        } else if (snapshot.hasError) {
                          return Text('${snapshot.error}');
                        }
                        // By default, show a loading spinner.
                        return const CircularProgressIndicator();
                      },
                    ),
                  ),


    FutureBuilder<Album>(
    future: futureAlbum,
    builder: (context, snapshot) {
    if (snapshot.hasData) {
      List<String> responses = snapshot.data?.responses ?? [];
      return Align(
          alignment: Alignment.center,
          child: Wrap(alignment: WrapAlignment.center,
                      children: [
                    MaterialButton(
                      onPressed: (){
                        selectionTracker = 0;
                       selectionstring = snapshot.data!.responses[0];
                        setState(() {
                          selectionMade = true;
                        buttonElevation = 4.0;
                      });} ,
        color: selectedColors['primaryColor'],
                        elevation: buttonElevation,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
        ),
        child: Text(snapshot.data!.responses[0],
            style: GoogleFonts.outfit(color: Colors.white))),
                    SizedBox(width: 15),
                    MaterialButton(
                        onPressed: (){
                          selectionTracker = 1;
                          selectionstring = snapshot.data!.responses[1];
                          setState(() {
                            selectionMade = true;
                          buttonElevation = 4.0;
                        });} ,
                        color: selectedColors['primaryColor'],
                        elevation: buttonElevation,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Text(snapshot.data!.responses[1],
                            style: TextStyle(color: Colors.white))),

                    ])
      );
      } else if (snapshot.hasError) {
      return Text('${snapshot.error}');
      }
      // By default, show a loading spinner.
      return const CircularProgressIndicator();
    },
    ),
                  SizedBox(height:5),
        Visibility(
            visible: selectionMade,
            child:
                  FutureBuilder<Album>(
                    future: futureAlbum,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        questionId = snapshot.data!.id;
                        return Column(
                          children: [
                            FutureBuilder<Album>(
                              future: futureAlbum,
                              builder: (context, snapshot) {
                                return MaterialButton(
                                  minWidth: MediaQuery.of(context).size.height / 4,
                                  height: 45,
                                  onPressed: () {
                                    sendAnswer(
                                        selectedGameMode, selectionTracker, userId,
                                        questionId, slugtoforum1, username1, selectionstring);
                                  },
                                  color: selectedColors['primaryColor'],
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(50),
                                  ),
                                  child: Text(
                                    "Go to forum!",
                                    style: GoogleFonts.outfit(color: Colors.white),
                                  ),
                                );
                              },
                            ),
                          ],
                        );
                      } else if (snapshot.hasError) {
                        return Text('${snapshot.error}');
                      }
                      // By default, show a loading spinner.
                      return const CircularProgressIndicator();
                    },
                  )),
        SizedBox(height:10),
        MaterialButton(
          minWidth: MediaQuery.of(context).size.height / 4,
          height: 45,
          onPressed: () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (context) => LoggedinPage(userId: userId, username: widget.username)));
          },
          color: selectedColors['primaryColor'],
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(50),
          ),
          child: Text(
            "Get a New Question",
            style: GoogleFonts.outfit(color: Colors.white),
          ),
        ),
                ])));
  }
}
