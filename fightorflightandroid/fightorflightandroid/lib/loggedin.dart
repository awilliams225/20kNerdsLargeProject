import 'package:flutter/material.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fightorflightandroid/forum.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

Future<void> sendAnswer(String gameMode, String selection, String userId, String questionId) async {
  final response = await http.post(
      Uri.parse(
          'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/api/answers/addAnswer'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      }, body: jsonEncode(<String, String>{
    'response': selection,
    'stance': gameMode,
    'questionId': questionId,
    'userId': userId,
  }),);
  Map<String, dynamic> jsonMap = jsonDecode(response.body);
  print(selection);
  print(gameMode);
  print(questionId);
  print(userId);
  if (response.statusCode == 200) {
    print("its working fine");
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
    'primaryColor': Color(0xffC80202),
    'accentColor': Color(0xff8545D7),
    'backgroundColor': Colors.white,
    'textColor': Colors.black,
  };

  static const flightModeColors = {
    'primaryColor': Colors.blue,
    'accentColor': Colors.orange,
    'backgroundColor': Colors.black,
    'textColor': Colors.white,
  };
}

class LoggedinPage extends StatefulWidget {
  final String userId;
  LoggedinPage({required this.userId});
  @override
  _LoggedinPageState createState() => _LoggedinPageState();
}

class _LoggedinPageState extends State<LoggedinPage> {
  late Map<String, Color> selectedColors;
  late String userId;
  String questionId = '';
  String slugtoforum = '';
  late String selection = '';
  String get response => selection;
  String get slugtoforum1 => slugtoforum;
  late String selectedGameMode;
  String get stance => selectedGameMode;
  late Future<Album> futureAlbum;

  @override
  void initState() {
    super.initState();
    userId = widget.userId;
    _loadGameMode();
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
    double buttonElevation = 0.0;
    return Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: selectedColors['backgroundColor'],
        appBar: AppBar(
          actions: [
            IconButton(
              onPressed: _toggleGameMode,
              icon: Icon((selectedGameMode == GameMode.fightMode) ? AppIcons.fightModeIcon : AppIcons.flightModeIcon,),
            ),
          ],
          elevation: 0,
          backgroundColor: selectedColors['primaryColor'],
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
          ),
        ),

        //Body begins
        body: Container(
            height: MediaQuery.of(context).size.height,
            width: double.infinity,
            decoration: BoxDecoration(color: selectedColors['primaryColor']),
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
                                    MediaQuery.of(context).size.height / 1.7,
                                width: double.infinity / 2,
                                decoration: BoxDecoration(
                                    color: Color(0xff8545D7),
                                    borderRadius: BorderRadius.circular(20)),
                                child: Center(
                                    child: Text(
                                  snapshot.data!.text,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
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
      return Row(mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                    MaterialButton(
                      onPressed: (){ selection = snapshot.data!.responses[0];
                        setState(() {
                        buttonElevation = 4.0;
                      });} ,
        color: Color(0xff8545D7),
                        elevation: buttonElevation,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
        ),
        child: Text(snapshot.data!.responses[0],
            style: const TextStyle(color: Colors.white))),
                    SizedBox(width: 10),
                    MaterialButton(
                        onPressed: (){
                          selection = snapshot.data!.responses[1];
                          setState(() {
                          buttonElevation = 4.0;
                        });} ,
                        color: Color(0xff8545D7),
                        elevation: buttonElevation,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Text(snapshot.data!.responses[1],
                            style: TextStyle(color: Colors.white))),
                    ]);
      } else if (snapshot.hasError) {
      return Text('${snapshot.error}');
      }
      // By default, show a loading spinner.
      return const CircularProgressIndicator();
    },
    ),
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
                                  height: 60,
                                  onPressed: () {
                                    sendAnswer(selectedGameMode, selection, userId, questionId);
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => ForumPage(
                                          slugtoforum: slugtoforum1,
                                          selectedGameMode: stance,
                                          response: selection,
                                        ),
                                      ),
                                    );
                                  },
                                  color: Color(0xff8545D7),
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(50),
                                  ),
                                  child: Text(
                                    "Go to forum!",
                                    style: TextStyle(color: Colors.white),
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
                  ),
    /*
    FutureBuilder<Album>(
    future: futureAlbum,
    builder: (context, snapshot) {
    if (snapshot.hasData) {
        questionId = snapshot.data!.id;
        return Column(children:[
                  MaterialButton(
                      minWidth: MediaQuery.of(context).size.height / 4,
                      height: 60,
                      onPressed: () {
                       sendAnswer(selectedGameMode, selection, userId, questionId);
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    ForumPage(slugtoforum: slugtoforum1, selectedGameMode: stance, selection: response)));
                      },
                      color: Color(0xff8545D7),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Text("Go to forum!",
                          style: TextStyle(color: Colors.white)))]);
    } else if (snapshot.hasError) {
      return Text('${snapshot.error}');
    }
    // By default, show a loading spinner.
    return const CircularProgressIndicator();
    },
    ),*/
                ])));
  }
}
