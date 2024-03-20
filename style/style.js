import { StyleSheet } from 'react-native';

//OWN COLOURS AND FONTS

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: 'sandybrown',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: 'sandybrown',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 10,
    flexDirection: "row",
    padding: 3,
    backgroundColor: 'chocolate',
    width: 250,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:"center"
  },
  buttonText: {
    color:"#2B2B52",
    fontSize: 20
  },
  gameText:{
    textAlign: "center"
  },
  playerInput:{
    textAlign: "center",
    borderWidth: 1,
    marginEnd: 50,
    marginStart: 50,
    marginTop: 10,
    marginBottom: 10
  },
  gameinfoTitle:{
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5
  },
  infoText:{
    paddingBottom: 10,
    padding: 10
  },
  scoreboard:{
    flex: 1
  }
});