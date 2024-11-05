import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { height } from '../../../utils/loader/loading'
import { screenHeight, screenWidth } from '../../../constants/styles'

const BlogDetails = () => {
  return (
    <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
            {/* 40 % image will occupy */}
            <Image style={{height: screenHeight * 0.4, width: screenWidth}} source={require('../../../assets/images/authbg.png')} />

            {/* Title of Blog */}
            <View style={{height: screenHeight * 0.2, width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <Text style={styles.title}>Blog Title Blog Title </Text>
            </View>

            {/* Content of Blog */}
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <Text style={styles.content}>Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here. Content of blog is here.</Text>
            </View>
        </ScrollView>
      <Text>BlogDetails</Text>
    </View>
  )
}

export default BlogDetails

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: '#333333',
        fontWeight: '900'
    },
    content: {
        fontSize: 12,
        color: '#33333350',
    },
    imgStyle: { height: 77, width: 77, marginRight: 14 }
})