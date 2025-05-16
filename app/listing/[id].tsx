import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Page = () => {
    const { id } = useLocalSearchParams<{id:string}>()
    console.log(id, "id details");
    
  return (
    <View>
      <Text>listing details</Text>
    </View>
  )
}

export default Page