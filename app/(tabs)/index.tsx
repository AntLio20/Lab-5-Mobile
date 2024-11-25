import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '../customHeader';  // Adjust path as necessary

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  // Use useFocusEffect to reload notes when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader title="Home" backgroundColor="#50C878" textColor="#fff" />

      {/* Space Below Header */}
      <View style={styles.headerSpace}></View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search notes by title..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.noteItem, { backgroundColor: item.color }]}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteSubtitle}>{item.subtitle}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No notes found.</Text>
      )}

      {/* Add Note Button */}
      <Link href="/addNote" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  noteItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  noteContent: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },  
  headerSpace: {
    height: 20, // Adjust this value to control the space below the header
  },
});

export default HomePage;