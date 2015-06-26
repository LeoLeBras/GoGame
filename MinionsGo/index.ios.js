'use strict';

var React = require('react-native'),
    SearchPage = require('./SearchPage');

var {
  StyleSheet,
  AppRegistry,
  Text,
  TextInput,
  View,
  Image,
  Component,
  TouchableHighlight,
  NavigatorIOS,
  ActivityIndicatorIOS
} = React;

class MinionsGo extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Home',
          component: SearchPage,
        }}/>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('MinionsGo', () => MinionsGo);
