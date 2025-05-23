import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpWindow'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'

const login = () => {
  useWarmUpBrowser()
  return (
    <View style={styles.container}>
      <TextInput style={[defaultStyles.inputField,{marginBottom:30}]} placeholder='Email' autoCapitalize='none' />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continuer</Text>
      </TouchableOpacity>
      <View style={styles.seperatorView}>
        <View style={{
          flex:1,
          borderBottomColor:"#000",
          borderBottomWidth:StyleSheet.hairlineWidth
        }} />
          <Text style={styles.seperator}>OU</Text>
         <View style={{
          flex:1,
          borderBottomColor:"#000",
          borderBottomWidth:StyleSheet.hairlineWidth
        }} />
      </View>
      <View style={{gap:20}}>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons name='call-outline' size={24}  style={defaultStyles.btnIcon}/>
          <Text style={styles.btnOutlineText}>Continue with phone</Text>
        </TouchableOpacity>
        
         <TouchableOpacity style={styles.btnOutline}>
          <Ionicons name="logo-google" size={24}  style={defaultStyles.btnIcon}/>
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.btnOutline}>
          <Ionicons name="logo-facebook" size={24}  style={defaultStyles.btnIcon}/>
          <Text style={styles.btnOutlineText}>Continue with facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },

  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
});

export default login