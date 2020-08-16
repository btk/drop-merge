import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import * as Font from 'expo-font';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const colors = [
  "",
  "#fee8be",
  "#fdb49e",
  "#f79894",
  "#df7a94",
  "#0e9da4",
  "#3672ac",
  "#4f54a3",
  "#5a3359",
  "#110e4b"
]

export default class App extends React.Component {
  state = {
    font: false,
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    nextnext: 0,
    next: 0,
    show: 0,
    dropAnim: [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
  }

  constructor(props){
    super(props);
    this.touchable = true;
    Font.loadAsync({
      'theboldfont': require('./assets/theboldfont.ttf')
    }).then(() => {
      this.setState({font: true});
    });
  }

  componentDidMount(){
    this.chooseNext();
  }

  drop(animatedValue, fromIndex, pushIndex){
    animatedValue.setValue(fromIndex*36);
    Animated.timing(animatedValue, {
      toValue: pushIndex * 36,
      duration: 200,
      useNativeDriver: true
    }).start(res => {
      animatedValue.setValue(0);
    });
  }

  chooseNext(){
    let next = getRandomInt(1, 5);
    if(this.state.nextnext){
      this.setState({nextnext: next, next: this.state.nextnext, show: this.state.nextnext});
    }else{
      let nextnext = getRandomInt(1, 5);
      this.setState({nextnext: next, next: nextnext, show: nextnext});
    }
  }

  pressedColumn(column){
    if(!this.touchable){
      return false;
    }

    this.touchable = false;
    let board = this.state.board;
    let boardColumn = board[column];
    let pushIndex = 9;
    while(pushIndex >= 0){
      if(boardColumn[pushIndex] == 0){
        break;
      }
      pushIndex--;
    }

    if(pushIndex == -1){
      alert("cant put it there");
    }else{
      boardColumn[pushIndex] = this.state.next;
      board[column] = boardColumn;
      this.drop(this.state.dropAnim[column], 0, pushIndex);
      setTimeout(() => {
        this.setState({board});
        this.merge(column);
        this.chooseNext();
      }, 200);
    }
  }


  merge(column){
    setTimeout(() => {
      let board = this.state.board;
      let boardColumn = board[column];

      let pointer = 0;
      let merged = false;
      while(pointer < 9){
        if(boardColumn[pointer] != 0){
          if(boardColumn[pointer] == boardColumn[pointer+1]){
            boardColumn[pointer+1] = boardColumn[pointer]+1;
            boardColumn[pointer] = 0;

            this.drop(this.state.dropAnim[column], pointer, pointer+1);
            this.setState({show: boardColumn[pointer+1]});
            merged = true;
            break;
          }
        }
        pointer++;
      }

      board[column] = boardColumn;
      this.setState({board});
      if(merged){
        this.merge(column);
      }else{
        this.touchable = true;
        this.setState({show: this.state.next});
      }
    }, 200);
  }

  render(){
    let board = this.state.board;

    if(this.state.font){
      return (
        <View style={styles.container}>
          <View style={styles.nextCarrier}>
            <Text>Next</Text>
            <View style={[styles.cell, {backgroundColor: this.state.nextnext ? colors[this.state.nextnext] : "#fff", width: "23%", transform: [{scale: 0.8}]}]}>
              {this.state.nextnext != "" &&
                <View style={styles.cellInner}>
                  <Text style={styles.cellText}>{this.state.nextnext}</Text>
                </View>
              }
            </View>
            <View style={[styles.cell, {backgroundColor: this.state.next ? colors[this.state.next] : "#fff", width: "23%"}]}>
              {this.state.next != "" &&
                <View style={styles.cellInner}>
                  <Text style={styles.cellText}>{this.state.next}</Text>
                </View>
              }
            </View>
          </View>
          <View style={styles.game}>
            {[0,1,2,3].map(column => {
              return (
                <TouchableOpacity key={column} onPress={() => this.pressedColumn(column)} style={styles.column} activeOpacity={0.9}>
                  {board[column].map((row, i) => {
                    return (
                      <View style={[styles.cell, {backgroundColor: row ? colors[row] : "#fff"}]} key={"cell"+column+"-"+i}>
                        {row != "" &&
                          <View style={styles.cellInner}>
                            <Text style={styles.cellText}>{row}</Text>
                          </View>
                        }
                      </View>
                    )
                  })}

                  <Animated.View style={[styles.cell, {backgroundColor: this.state.show ? colors[this.state.show] : "#fff", position: "absolute", top: 5, left: 0, right: 0, opacity: this.state.dropAnim[column], transform: [{translateY: this.state.dropAnim[column]}]}]}>
                    <View style={styles.cellInner}>
                      <Text style={styles.cellText}>{this.state.show}</Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      );
    }else{
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCarrier: {
    width: Dimensions.get("window").width - 30,
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  game: {
    flexDirection: "row",
    width: Dimensions.get("window").width - 30
  },
  column: {
    width: "25%",
    borderWidth: 2,
    borderColor: "#fafafa",
    backgroundColor:"#fff",
    borderRadius: 7,
    paddingBottom: 5,
    paddingTop: 5,
  },
  cell: {
    height: 36,
    borderRadius: 7,
    margin: 3,
    marginTop: 0,
    marginBottom: 0,
  },
  cellInner: {
    flex: 1,
    marginTop: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  cellText: {
    fontFamily: "theboldfont",
    color: "#fff",
    fontSize: 16
  }
});
