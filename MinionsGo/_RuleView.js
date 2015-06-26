'use strict';

var React = require('react-native'),
    SearchResults = require('./Dispatcher'),
    {vw, vh, vmin, vmax} = require('react-native-viewport-units');

var {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Component
} = React;

class RuleView extends Component {
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
    var property = this.props.property;
    return (
      <Image source={require('image!view')} style={styles.home}>
          <View style={styles.goHome}>
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
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.kanji}>{property.kanji}</Text>
          </View>
          <Text style={styles.title}>{property.title}</Text>
       <Text style={styles.summury}>{property.description}</Text>
       </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: 70*vw,
    height: 46*vh,
    margin: 15*vw,
    marginTop: 5*vh,
    backgroundColor: 'transparent'
  },
    searchInput: {
    width: 70*vw,
    height: 36,
    padding: 4,
    paddingTop: 10,
    paddingLeft: 27*vw,
    marginRight: 5,
    marginTop: 10*vh,
    flex: 4,
    alignSelf: 'center',
    fontSize: 24,
    borderRadius: 5,
    backgroundColor: '#495861',
    color: '#FCCA3F',
    fontFamily: 'BebasNeueRegular'
  },
  header: {
    width: 70*vw,
    height: 12*vh,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },
  kanji: {
    color: 'black',
    fontSize: 65
  },
  title: {
    fontSize: 40,
    textAlign: 'left',
    marginLeft: 10,
    top: -12,
    fontFamily: 'BebasNeueBold',
    color: 'white'
  },
  summury: {
    fontSize: 21,
    lineHeight: 24,
    textAlign: 'auto',
    margin: 6,
    marginLeft: 10,
    top: -12,
    color: 'white',
    fontWeight: '100',
    fontFamily: 'BebasNeueRegular'
  },
  goHome: {
    backgroundColor: 'transparent'
  },
  home: {
    width: 100*vw,
    height: 100*vh,
    marginTop: 3*vh
  }
});

module.exports = RuleView;
