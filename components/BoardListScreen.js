import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const appImage = require('../assets/todo.png');

export default function BoardListScreen({navigation}) {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [showInput, setShowInput] = useState(false); // 👈 to toggle input visibility

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const stored = await AsyncStorage.getItem('boards');
    if (stored) setBoards(JSON.parse(stored));
  };

  const saveBoards = async updatedBoards => {
    setBoards(updatedBoards);
    await AsyncStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  const addBoard = () => {
    if (!newBoardName.trim()) return;
    const newBoard = {
      id: Date.now().toString(),
      title: newBoardName,
      lists: [],
    };
    const updated = [...boards, newBoard];
    saveBoards(updated);
    setNewBoardName('');
    setShowInput(false); // 👈 hide input after adding
  };

  const deleteBoard = id => {
    const updated = boards.filter(b => b.id !== id);
    saveBoards(updated);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={appImage} style={styles.appImageIcon} />
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#00c2ff',
            marginLeft: 30,
          }}>
          TaskFellow
        </Text>
      </View>
      {/* Header with + button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boards</Text>
        <TouchableOpacity
          onPress={() => setShowInput(!showInput)}
          style={styles.plusButton}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Input for Board Name */}
      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter board name"
            style={styles.input}
            value={newBoardName}
            onChangeText={setNewBoardName}
          />
          <View style={{marginTop: 16}}>
            <TouchableOpacity style={styles.addBoardButton} onPress={addBoard}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000'}}>
                Add Board
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={{
          backgroundColor: '#ffbb52',
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
        }}>
        <Text style={{fontSize: 26, fontWeight: 'bold', color: '#4d22b4'}}>
          Your WorkSpace
        </Text>
        <FlatList
          data={boards}
          vertical
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.boardItem}
              onPress={() =>
                navigation?.navigate('BoardDetail', {
                  boardId: item?.id,
                  title: item?.title,
                })
              }>
              <View style={styles.boardRow}>
                <Text style={styles.boardTitle}>{item.title}</Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteBoard(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1, marginTop: 40, backgroundColor: '#4d4d4d'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  appImageIcon: {width: 50, height: 50, borderRadius: 20},
  plusButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: '#0a0100',
  },
  boardItem: {
    padding: 15,
    backgroundColor: '#ddd',
    marginVertical: 5,
    borderRadius: 8,
    marginTop: 20,
  },
  addBoardButton: {
    backgroundColor: '#1672fe',
    padding: 12,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff7566',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
});
