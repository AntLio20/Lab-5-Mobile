import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../customHeader'; // Import your CustomHeader component

export default function AddNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const colors = ['#ffffff', '#ffeb3b', '#8bc34a', '#03a9f4', '#e91e63', '#9c27b0'];

  const handleSubmit = async () => {
    if (title && content) {
      try {
        const newNote = { id: Date.now(), title, subtitle, content, color: selectedColor };

        const existingNotesString = await AsyncStorage.getItem('notes');
        const existingNotes = existingNotesString ? JSON.parse(existingNotesString) : [];

        const isDuplicate = existingNotes.some(
          (note: { title: string; content: string }) => note.title === title && note.content === content
        );
        if (isDuplicate) {
          alert('This note already exists.');
          return;
        }

        const updatedNotes = [...existingNotes, newNote];
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

        // Reset fields after saving
        setTitle('');
        setSubtitle('');
        setContent('');
        setSelectedColor('#ffffff');

        router.push('/');
      } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note. Please try again.');
      }
    } else {
      alert('Please fill out the title and content fields.');
    }
  };

  const handleDiscard = () => {
    // Reset fields after discarding
    setTitle('');
    setSubtitle('');
    setContent('');
    setSelectedColor('#ffffff');
    router.push('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Custom Header */}
      <CustomHeader title="Add Note" backgroundColor="#50C878" textColor="#fff" />

      {/* Space Below Header */}
      <View style={styles.headerSpace}></View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Subtitle (optional)"
        value={subtitle}
        onChangeText={setSubtitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Note Color Selector */}
      <Text style={styles.colorLabel}>Select Note Color:</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 1 },
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Discard Button */}
      <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
        <Text style={styles.discardButtonText}>Discard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  headerSpace: {
    height: 20, // Adjust this value to control the space below the header
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  colorLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  discardButton: {
    backgroundColor: '#e91e63', // Red color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  discardButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
