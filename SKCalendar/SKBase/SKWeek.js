'use strict';

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

export default class SKWeek extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            weekDay: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.weekDay);
    }

    _dayView(weekDay = []) {
        if (weekDay) {
            let dayViewArr = [];
            for (let index = 0; index < weekDay.length; index++) {
                let dayObj = weekDay[index];
                if (dayObj) {
                    let bgColor = '#ffffff';
                    if (dayObj.selected) {
                        bgColor = '#40E0D0';
                    }
                    if (dayObj.today) {
                        bgColor = '#33b2da';
                    }
                    let dayView =
                        <TouchableOpacity
                            key={'day' + index}
                            style={{
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                height: 36,
                                width: 36,
                                borderWidth: dayObj.todaySame ? 1 : 0,
                                borderColor: 'gray',
                                borderRadius: 18,
                                backgroundColor: bgColor,
                            }}
                            onPress={() => {
                                DeviceEventEmitter.emit('SKCalendarDeviceEventEmitter', JSON.stringify(dayObj));
                            }}
                        >
                            <View style={{
                                height: 6,
                                width: 6,
                            }} />
                            <Text style={{ fontSize: 16, color: dayObj.today ? '#fff' : '#000' }}>{dayObj.dayKey}</Text>
                            {dayObj.marked ?
                                <View style={{
                                    height: 6,
                                    width: 6,
                                    backgroundColor: '#A0522D',
                                    borderRadius: 3,
                                }} /> :
                                <View style={{
                                    height: 6,
                                    width: 6,
                                }} />}
                        </TouchableOpacity>;
                    dayViewArr.push(dayView);
                } else {
                    let dayView =
                        <View
                            key={'day' + index}
                            style={{
                                height: 36,
                                width: 36,
                            }} />;
                    dayViewArr.push(dayView);
                }
            }
            return dayViewArr;
        }
        return null;
    }

    render() {
        const { height, width, backgroundColor, weekDay } = this.props;
        return (

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                height,
                width,
                backgroundColor,
            }}>
                {this._dayView(weekDay)}
            </View>
        );
    }
}