import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function ListComponent({list, updateList, deleteList}) {
  const [newCard, setNewCard] = useState('');

  const addCard = () => {
    if (!newCard.trim()) return;
    const newCardObj = {id: Date.now().toString(), title: newCard};
    const updated = {...list, cards: [...list.cards, newCardObj]};
    updateList(list.id, updated);
    setNewCard('');
  };

  const deleteCard = cardId => {
    const updated = {...list, cards: list.cards.filter(c => c.id !== cardId)};
    updateList(list.id, updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{list.title}</Text>
      <FlatList
        data={list.cards}
        vertical
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#00235c',
              }}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.deleteListButton}
              onPress={() => deleteCard(item.id)}>
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        placeholder="New Card"
        value={newCard}
        onChangeText={setNewCard}
        style={styles.input}
      />
      <View style={{marginTop: 16}}>
        <TouchableOpacity style={styles.addCardButton} onPress={addCard}>
          <Text style={styles.textStyle}>Add Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteListButton}
          onPress={() => deleteList(list.id)}>
          <Text style={styles.textStyle}>Delete List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
  },
  textStyle: {fontSize: 18, fontWeight: 'bold', color: '#000'},
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 5},
  card: {
    backgroundColor: '#ffa666',
    borderRadius: 8,
    marginBottom: 16,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
    padding: 14,
    borderRadius: 5,
  },
  addCardButton: {
    backgroundColor: '#1672fe',
    paddingVertical: 12,
    width: 300,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
  },
  deleteListButton: {
    backgroundColor: '#ff7566',
    borderRadius: 8,
    width: 300,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
});
