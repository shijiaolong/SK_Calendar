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

import SKWeek from './SKWeek';

export default class SKMonth extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            monthData: [],
        }
    }

    componentDidMount() {

        if (this.props.year && this.props.month && this.props.day) {
            let mData = this._monthData(this.props.year, this.props.month, this.props.day, this.props.clickDayObj);
            // console.log(mData);
            this.setState({
                monthData: mData
            });
        } else {
            console.log('日期错误');
        }

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.year && nextProps.month && nextProps.day) {
            let mData = this._monthData(nextProps.year, nextProps.month, nextProps.day, nextProps.clickDayObj);
            // console.log(mData);
            this.setState({
                monthData: mData
            });
        } else {
            console.log('日期错误');
        }

    }

    //根据时间组合每天的对象(逻辑处理)
    _createDayObject(year, month, day, clickDayObj) {
        // 格式(根据功能修改)
        // let dayObj = { yearKey:year, monthKey:month, dayKey: day, marked: true, selected: true, today: true, todaySame:false };
        let dayObj = { yearKey: year, monthKey: month, dayKey: day };

        //今天
        if (year == 2018 && month == 1 && day == 23) {
            dayObj.today = true;
        }

        //是否与今天同号
        if (day == 23) {
            dayObj.todaySame = true;
        }

        //测试而已（标记）
        if (day % 3 == 0) {
            dayObj.marked = true;
        }

        //默认值false
        dayObj.selected = false;

        //点击事件
        if (clickDayObj) {
            if ((clickDayObj.yearKey == year) && (clickDayObj.monthKey == month) && (clickDayObj.dayKey == day)) {
                dayObj.selected = true;
            }
        }

        return dayObj;
    }

    // 根据当月的1号判断周几，然后显示多少周
    _monthData(year, month, day, clickDayObj) {

        //获取年月日字符串
        let ymdStr = this._getYmdStr(year, month, day);

        //根据日期获取当前月1号是周几(0周日，1周一。。。6周六)
        let week = new Date(ymdStr).getDay();

        //获取这月多少天
        let monthDay = this._getMonthDay(year, month, day);

        //根据第一天的位置和月数计算多少周（即多少行显示）
        let weekNum = parseInt((monthDay + week) / 7);
        if ((monthDay + week) % 7 > 0) {
            weekNum++;
        }

        //填充数据
        let monthWeek = [];
        for (let i = 0; i < weekNum; i++) {
            let weekDay = [];
            for (let j = 0; j < 7; j++) {
                let dayTemp = (i * 7 + j - week + 1);
                if (dayTemp > 0) {
                    if (dayTemp > monthDay) {
                        weekDay.push(null);
                    } else {
                        //根据时间组合每天的对象(注意参数dayTemp)
                        let dayObj = this._createDayObject(year, month, dayTemp, clickDayObj);
                        weekDay.push(dayObj);
                    }
                } else {
                    weekDay.push(null);
                }
            }
            monthWeek.push(weekDay);
        }
        //这月的数据
        return monthWeek;
    }

    //判断当前月是多少天
    _getMonthDay(year, month) {

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            return 31;
        }

        if (month == 4 || month == 6 || month == 9 || month == 11) {
            return 30;
        }

        if (month == 2) {
            if ((year % 100 == 0) || (year % 400 == 0)) {
                return 29;
            }
            return 28;
        }

        return 0;
    }

    //组合年月日
    _getYmdStr(year, month, day) {

        let ymd = year + '-';
        if (month < 10) {
            ymd = ymd + '0' + month + '-';
        } else {
            ymd = ymd + month + '-';
        }
        if (day < 10) {
            ymd = ymd + '0' + day + '';
        } else {
            ymd = ymd + day + '';
        }
        console.log('组合年月日:' + ymd);
        return ymd;

    }

    //月视图
    _monthView(monthData = [], width) {
        let weekDayView = [];
        for (let index = 0; index < monthData.length; index++) {
            let weekDayArr = monthData[index];
            let weekView = <SKWeek key={'week' + index} height={60} width={width} weekDay={weekDayArr} />;
            weekDayView.push(weekView);
        }
        return weekDayView;
    }

    render() {
        const { height, width, backgroundColor } = this.props;
        return (
            <View style={{
                height,
                width,
                backgroundColor,
                justifyContent: 'space-around',
                alignItems: 'center',
            }}>
                {this._monthView(this.state.monthData, width)}
            </View>
        );
    }
}