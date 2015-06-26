'use strict';

var React = require('react-native'),
    SearchResults = require('./SearchResults'),
    {vw, vh, vmin, vmax} = require('react-native-viewport-units');

var {
  StyleSheet,
  Component,
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class SearchPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchString: '',
      isLoading: 'false',
      message: ''
    }
  }

  onSearchTextChanged(event){
    console.log('Search text has changed !');
    this.setState({ searchString: event.nativeEvent.text });
    console.log(this.state.searchString);
  }

  _handleResponse(response) {
    var title = this.state.searchString;
    if (response != '') {
        this.setState({ isLoading: false , message: ''});
        this.props.navigator.push({
        title: title,
        component: SearchResults,
        passProps: {listings: response}
      });
    } else {
      this.setState({ message : "Aucun résulat : essaie encore !"});
    }
  }

onSearchPressed() {
      var tab = require('./API');
      var value = this.state.searchString; 
      var query = [];
      var cache = [];
      var description = [];

      for(var i in tab){
          description = tab[i].description.split(' ');
          if((tab[i].categories.indexOf(value) != -1 || tab[i].title == value || description.indexOf(value) != -1)
            && cache.indexOf(tab[i].title) == -1){
            query.push(tab[i]);
            cache.push(tab[i].title);
          }
      }
      this._handleResponse(query);
    }



  render() {
    return (
      <Image source={require('image!home')} style={styles.home}>
        <View style={styles.container}>
          <View style={styles.flowRight}>
            <TextInput
              style={styles.searchInput}
              value={this.state.searchString}
              onChange={this.onSearchTextChanged.bind(this)}
              placeholder= 'Search'
              placeholderTextColor= '#FCCA3F'
              clearTextOnFocus= 'true'
              autoCapitalize= 'words'
              onSubmitEditing={this.onSearchPressed.bind(this)}/>
          </View>
          <Text style={styles.description}>{this.state.message}</Text>
        </View>
        </Image>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    marginBottom: 9*vh,
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center',
    color: 'white'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFC300',
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    paddingTop: 10,
    paddingLeft: 33*vw,
    marginRight: 5,
    marginBottom: 30*vw,
    marginTop: 23*vh,
    flex: 4,
    fontSize: 24,
    borderRadius: 5,
    backgroundColor: '#495861',
    color: '#FCCA3F',
    fontFamily: 'BebasNeueRegular'
  },
  home: {
    width: 100*vw,
    height: 100*vh,
    marginTop: 7*vh
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});

module.exports = SearchPage;
