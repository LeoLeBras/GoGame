'use strict';

var React = require('react-native'),
    RuleView = require('./RuleView'),
    {vw, vh, vmin, vmax} = require('react-native-viewport-units');

var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

class SearchResults extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
  }

  rowPressed(propertyGuid) {
    var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];


    this.props.navigator.push({
      title: property.title,
      component: RuleView,
      passProps: {property: property}
    });
}

  renderRow(rowData, sectionID, rowID) {
  return (
    <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
        underlayColor='#ffe799'
        style={styles.border}>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.price}>{rowData.title}</Text>
          </View>
        </View>
    </TouchableHighlight>
  );
}

  render() {
    console.log(this.state.dataSource);
    var title = this.state.searchString;
    return (
      <Image source={require('image!results')} style={styles.results}>
      <View style={styles.container}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        style={styles.listView}/>
      </View>
      </Image>
    );
  }
}

  var styles = StyleSheet.create({
    container : {
      width: 80*vw,
      height: 49*vh,
      marginLeft: 10*vw,
      marginTop: 17*vh,
      backgroundColor: '#81CDEA',
      borderWidth: 1,
      borderColor: '#81CDEA',
      borderRadius: 8
    },
    listView:{
      backgroundColor: 'transparent'
    },
    tile: {
      backgroundColor: 'transparent',
    },
    textContainer: {
      flex: 1,
      backgroundColor: 'transparent'
    },
    price: {
      fontSize: 25,
      fontFamily: 'BebasNeueBold',
      color: '#FFC300'
    },
    title: {
      fontSize: 20,
      top: -300,
      color: '#656565',
      fontFamily: 'BebasNeueRegular',
    },
    results: {
      width: 100*vw,
      height: 100*vh,
      marginTop: 9*vh
    },
    rowContainer: {
      flexDirection: 'row',
      padding: 10
    }
  });


module.exports = SearchResults;
