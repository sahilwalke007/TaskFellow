import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListComponent from './ListComponent';
const backIcon = require('../assets/arrow.png');

const {width: screenWidth} = Dimensions.get('window');

export default function BoardDetailScreen({route, navigation}) {
  const {boardId, title} = route.params;
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    const stored = await AsyncStorage.getItem('boards');
    const boards = stored ? JSON.parse(stored) : [];
    const found = boards.find(b => b.id === boardId);
    if (found) setBoard(found);
  };

  const saveBoard = async (updatedBoard, scrollToIndex = null) => {
    const stored = await AsyncStorage.getItem('boards');
    const boards = stored ? JSON.parse(stored) : [];
    const updated = boards.map(b =>
      b.id === updatedBoard.id ? updatedBoard : b,
    );
    await AsyncStorage.setItem('boards', JSON.stringify(updated));
    setBoard(updatedBoard);

    if (
      scrollToIndex !== null &&
      flatListRef.current &&
      updatedBoard.lists.length > 0
    ) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: scrollToIndex,
          animated: true,
        });
      }, 300);
    }
  };

  const addList = () => {
    if (!newListTitle.trim()) return;
    const newList = {
      id: Date.now().toString(),
      title: newListTitle,
      cards: [],
    };
    const updatedBoard = {
      ...board,
      lists: [...board.lists, newList],
    };
    const scrollToIndex = updatedBoard.lists.length - 1;
    saveBoard(updatedBoard, scrollToIndex);
    setNewListTitle('');
  };

  const updateList = (listId, updatedList) => {
    const updatedLists = board.lists.map(l =>
      l.id === listId ? updatedList : l,
    );
    const updatedBoard = {...board, lists: updatedLists};
    saveBoard(updatedBoard);
  };

  const deleteList = listId => {
    const updatedBoard = {
      ...board,
      lists: board.lists.filter(l => l.id !== listId),
    };
    saveBoard(updatedBoard);
  };

  const renderListItem = ({item, index}) => {
    if (item.isAddCard) {
      return (
        <View style={[styles.addListCard, {width: screenWidth}]}>
          <Text style={styles.addListTitle}>Add New List</Text>
          <TextInput
            placeholder="Enter List Title"
            style={styles.input}
            value={newListTitle}
            onChangeText={setNewListTitle}
          />
          <TouchableOpacity style={styles.addListButton} onPress={addList}>
            <Text style={styles.deleteButtonText}>Add List</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.page, {width: screenWidth}]}>
        <ListComponent
          list={item}
          updateList={updateList}
          deleteList={deleteList}
        />
      </View>
    );
  };

  const combinedLists = board?.lists
    ? [...board.lists, {id: 'add_list_card', isAddCard: true}]
    : [];

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={combinedLists}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderListItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#006585'},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#00c1ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 22,
    color: '#333',
  },
  backIcon: {width: 16, height: 16},
  page: {
    flex: 1,
    padding: 10,
  },

  addListCard: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 200,
  },
  addListButton: {
    backgroundColor: '#1672fe',
    paddingVertical: 12,
    width: 300,
    marginTop: 16,
    alignItems: 'center',
    borderRadius: 20,
  },
  addListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
});
