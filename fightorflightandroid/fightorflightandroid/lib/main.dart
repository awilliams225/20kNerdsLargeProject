import 'package:flutter/material.dart';
import 'package:fightorflightandroid/login.dart';
import 'package:fightorflightandroid/register.dart';
import 'package:provider/provider.dart';
//import 'package:fightorflightandroid/provider.dart';
import 'package:fightorflightandroid/profile.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
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
        backgroundColor: Color(0xff8c3f98),
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
                 Container(padding:EdgeInsets.only(left:20), child:
                 Image.asset('assets/fightorflightlogo.png')),
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
                        borderRadius: BorderRadius.circular(50)),
                   child: Text("Login", style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w600, fontSize:22)),
                ),
                SizedBox(height:20),
                MaterialButton(minWidth: double.infinity, height: 60,
                    onPressed:(){
                  Navigator.push(context, MaterialPageRoute(builder: (context) => RegistrationPage()));},
                   // color: Colors.white,
                   shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50)),
                  child: Text("Register", style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 22)),
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
