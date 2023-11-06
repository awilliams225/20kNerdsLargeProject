import 'package:flutter/material.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:fightorflightandroid/register.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
       child: Container(
         width: double.infinity,
         height: MediaQuery.of(context).size.height,
         padding: EdgeInsets.symmetric(horizontal: 30, vertical: 50),
         child: Column(
           mainAxisAlignment: MainAxisAlignment.spaceBetween,
           crossAxisAlignment: CrossAxisAlignment.center,
           children: <Widget>[
             Column(
               children: <Widget>[
                 Text("Welcome to Fight or Flight", textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30)),
                 SizedBox(height: 20),
                 ]),
          Column(
      children: <Widget>[
                 MaterialButton(
                  minWidth: double.infinity,
                  height: 60,
                  onPressed: (){
                    Navigator.push(context, MaterialPageRoute(builder:(context)=> LoginPage()));
                    },
                    shape: RoundedRectangleBorder(
                     side: BorderSide(
                     color: Colors.black
                 ),
                        borderRadius: BorderRadius.circular(50)),
                   child: Text("Login", style: TextStyle(fontWeight: FontWeight.w600, fontSize:18)),
                ),
                SizedBox(height:20),
                MaterialButton(minWidth: double.infinity, height: 60,
                    onPressed:(){Navigator.push(context, MaterialPageRoute(builder: (context) => RegistrationPage()));},
                    color: Color(0xff),
                   shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50)),
                  child: Text("Register", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 18)),
                )
               ]
             )

           ]
         )
       )
      )
    );
  }
}
