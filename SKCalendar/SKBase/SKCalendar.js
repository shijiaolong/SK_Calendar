'use strict';

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    InteractionManager,
    DeviceEventEmitter
} from 'react-native';

const { height, width } = require('Dimensions').get('window');

import SKMonth from './SKMonth';

export default class SKCalendar extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            firstYear: null,
            firstMonth: null,
            firstDay: null,
            secondYear: null,
            secondMonth: null,
            secondDay: null,
            thirdYear: null,
            thirdMonth: null,
            thirdDay: null,
            schedule: '暂无日程',
            clickDayObj: null,
        }
        this._scrollView = null;
    }

    componentWillMount() {
        //添加通知来监听点击事件
        this._clickDeviceEventEmitter = DeviceEventEmitter.addListener('SKCalendarDeviceEventEmitter', (clickDayObj) => {

            let obj = JSON.parse(clickDayObj);
            this.setState({
                ...this.state,
                schedule: obj.marked ? '这天有日程' : '暂无日程',
                clickDayObj: obj,
            });

        });
    }

    componentDidMount() {

        this._scrollView.scrollTo({ x: width, y: 0, animated: false });

        InteractionManager.runAfterInteractions(() => {
            this.setState({
                firstYear: 2017,
                firstMonth: 12,
                firstDay: 31,
                secondYear: 2018,
                secondMonth: 1,
                secondDay: 1,
                thirdYear: 2018,
                thirdMonth: 2,
                thirdDay: 1,
                schedule: '暂无日程',
                clickDayObj: null,
            });
        });
    }

    componentWillUnmount() {
        this._clickDeviceEventEmitter && this._clickDeviceEventEmitter.remove();
    }

    // 修改数据
    _changeData(params) {
        let scrollX = params.nativeEvent.contentOffset.x;
        if (scrollX > width) {
            this._nextMonth();
        } else if (scrollX < width) {
            this._preMonth();
        } else {
            console.log('滑动错误');
        }
        this._scrollView.scrollTo({ x: width, y: 0, animated: false });
    }

    // 下个月
    _nextMonth() {

        let fy = this.state.firstYear;
        let fm = this.state.firstMonth;
        let sy = this.state.secondYear;
        let sm = this.state.secondMonth;
        let ty = this.state.thirdYear;
        let tm = this.state.thirdMonth;

        if ((++fm) > 12) {
            fm = 1;
            if ((++fy) > 9999) {
                fy = 9999;
            }
        }

        if ((++sm) > 12) {
            sm = 1;
            if ((++sy) > 9999) {
                sy = 9999;
            }
        }
        if ((++tm) > 12) {
            tm = 1;
            if ((++ty) > 9999) {
                sy = 9999;
            }
        }

        this.setState({
            firstYear: fy,
            firstMonth: fm,
            firstDay: 1,
            secondYear: sy,
            secondMonth: sm,
            secondDay: 1,
            thirdYear: ty,
            thirdMonth: tm,
            thirdDay: 1,
            schedule: '暂无日程',
            clickDayObj: null,
        });

    }

    // 上一月
    _preMonth() {
        let fy = this.state.firstYear;
        let fm = this.state.firstMonth;
        let sy = this.state.secondYear;
        let sm = this.state.secondMonth;
        let ty = this.state.thirdYear;
        let tm = this.state.thirdMonth;

        if ((--fm) <= 0) {
            fm = 12;
            if ((--fy) < 1900) {
                fy = 1900;
            }
        }

        if ((--sm) <= 0) {
            sm = 12;
            if ((--sy) < 1900) {
                sy = 1900;
            }
        }
        if ((--tm) <= 0) {
            tm = 12;
            if ((--ty) < 1900) {
                ty = 1900;
            }
        }

        this.setState({
            firstYear: fy,
            firstMonth: fm,
            firstDay: 1,
            secondYear: sy,
            secondMonth: sm,
            secondDay: 1,
            thirdYear: ty,
            thirdMonth: tm,
            thirdDay: 1,
            schedule: '暂无日程',
            clickDayObj: null,
        });

    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#33b2da',
            }}>

                {/* 年月 */}
                <View style={{
                    marginTop: 20,
                    height: 50,
                    width: width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#33b2da',
                }}>
                    <Text style={{ fontSize: 20, color: '#000000', }}>
                        {this.state.secondYear + '年' + ' ' + this.state.secondMonth + '月'}
                    </Text>
                </View>

                {/* 星期周 */}
                <View style={{
                    flexDirection: 'row',
                    height: 35,
                    width: width,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    backgroundColor: '#33b2da'
                }}>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'日'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'一'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'二'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'三'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'四'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'五'}</Text>
                    </View>
                    <View style={styles.weekViewStyle}>
                        <Text style={styles.weekTextStyle}>{'六'}</Text>
                    </View>
                </View>

                {/* 月号 */}
                {/* <View style={{ height: 280, width: width, backgroundColor: 'blue' }}>
                    <ScrollView style={{ height: 280, width: width, backgroundColor: 'green' }} bounces={true}> */}
                <View style={{ height: 300, width: width, backgroundColor: 'red' }}>
                    <ScrollView
                        ref={(sv) => { this._scrollView = sv }}
                        style={{ height: 300, width: width }}
                        horizontal={true}
                        pagingEnabled={true}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollStart={(params) => {
                            console.log('滚动开始');
                        }}
                        onMomentumScrollEnd={(params) => {
                            console.log('滚动结束');
                            this._changeData(params);
                        }}>

                        <SKMonth
                            height={300}
                            width={width}
                            backgroundColor={'white'}
                            year={this.state.firstYear}
                            month={this.state.firstMonth}
                            day={this.state.firstDay}
                            clickDayObj={this.state.clickDayObj}
                        />
                        <SKMonth
                            height={300}
                            width={width}
                            backgroundColor={'white'}
                            year={this.state.secondYear}
                            month={this.state.secondMonth}
                            day={this.state.secondDay}
                            clickDayObj={this.state.clickDayObj}
                        />
                        <SKMonth
                            height={300}
                            width={width}
                            backgroundColor={'white'}
                            year={this.state.thirdYear}
                            month={this.state.thirdMonth}
                            day={this.state.thirdDay}
                            clickDayObj={this.state.clickDayObj}
                        />
                    </ScrollView>
                </View>
                {/* </ScrollView>
                </View> */}

                {/* 日程 */}
                <View style={{ flex: 1, backgroundColor: '#F5FCFF' }} >
                    <Text>{this.state.schedule}</Text>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    weekViewStyle: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekTextStyle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#ffffff',
    }
});
