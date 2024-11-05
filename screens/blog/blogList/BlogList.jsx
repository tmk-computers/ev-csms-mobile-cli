import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const DATA = [
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') },
    { title: "This is the title", author: "Author Name", date: "20-10-2024", imgRes: require('../../../assets/images/authbg.png') }
]
const BlogList = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                data={DATA}
                ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: '#ccc' }} />}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("BlogDetails")
                        }} style={{ flexDirection: 'row', padding: 14 }}>
                            <Image source={item.imgRes} style={styles.imgStyle} />
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.author}>{item.author}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default BlogList

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: '#333333',
        flex: 0.7,
    },
    author: {
        fontSize: 12,
        color: '#33333350',
    },
    imgStyle: { height: 77, width: 77, marginRight: 14 }
})