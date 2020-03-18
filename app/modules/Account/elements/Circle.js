import React, { Component } from "react"
import { View, Text } from "react-native"

import { BoxShadow } from 'react-native-shadow'


class Circle extends Component {

    constructor(props){
        super(props)
    }

    render(){

        const { width, height, border, backgroundColor, backgroundInnerColor } = this.props.style

        return (
            <View style={[styles.circle, { top: -(width / 4), width, height }]}>
                <BoxShadow setting={{...styles.circle__item, width, height, radius: width / 2, color: backgroundColor, backgroundColor}}>
                    <View style={[styles.circle__item__inner, { backgroundColor }]}>
                        <View style={[styles.circle__item__transparent, { width: width - border, height: height - border, backgroundColor: backgroundInnerColor }]}>
                            { this.props.children ? this.props.children : null }
                        </View>
                    </View>
                </BoxShadow>
            </View>
        )
    }
}

export default Circle


const styles = {
    circle: {
        position: "relative",
        top: -2,

        width: 10,
        height: 10,
        borderRadius: 50
    },
    circle__item: {
        width: 10,
        height: 10,
        color: "#F59E6C",
        border: 4,
        radius: 5,
        opacity: 0.2,
        x: 0,
        y: 0,
        style: {
            marginVertical: 5,
            borderRadius: 50
        },
    },
    circle__item__inner: {
        alignItems: "center",
        justifyContent: "center",

        width: "100%",
        height: "100%",
        backgroundColor: "#F59E6C",
        borderRadius: 50
    },
    circle__item__transparent: {
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 50
    }
}
