// components/CustomHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomHeaderProps {
  title: string; // Page name
  backgroundColor: string; // Settable header background color
  textColor: string; // Settable text color for the title
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, backgroundColor, textColor }) => {
  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <Text style={[styles.headerText, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomHeader;