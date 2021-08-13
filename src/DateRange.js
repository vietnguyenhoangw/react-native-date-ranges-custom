import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import normalize from "./normalizeText";
import Month from "./Month";

const styles = {
  calendar: {
    backgroundColor: "rgb(255, 255, 255)",
    marginHorizontal: normalize(10),
    marginTop: 10
  },
  headActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headCoverContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    height: normalize(145),
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#F5A623",
    paddingHorizontal: 20
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headTitleText: {
    fontSize: normalize(20),
    color: "white",
    fontWeight: "bold"
  },
  headerDateSingle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold"
  }
};

export default class DateRange extends Component {
  constructor(props) {
    super(props);
    const defalutFormat =
      !props.mode || props.mode === "single" ? "DD/MM/YYYY" : "DD/MM/YYYY";
    this.state = {
      focusedMonth: moment().startOf("month"),
      currentDate: props.currentDate || moment(),
      startDate: props.startDate || "",
      endDate: props.endDate || "",
      focus: props.focusedInput || "startDate",
      clearStart: "",
      clearEnd: "",
      clearSingle: props.currentDate.format(defalutFormat) || "",
      selectState: "monthAndDate", // or year
      selectedYear: null
    };
  }
  previousMonth = () => {
    this.setState({
      focusedMonth: this.state.focusedMonth.add(-1, "M")
    });
  };
  nextMonth = () => {
    this.setState({
      focusedMonth: this.state.focusedMonth.add(1, "M")
    });
  };
  onDatesChange = event => {
    this.props.onDatesChange(event);
    const defalutFormat =
      !this.props.mode || this.props.mode === "single"
        ? "DD/MM/YYYY"
        : "DD/MM/YYYY";
    const headFormat = this.props.headFormat || defalutFormat;
    const { startDate, endDate, focusedInput, currentDate } = event;
    if (currentDate) {
      this.setState({ currentDate });
      this.setState({ clearSingle: currentDate.format(headFormat) });
      return;
    }
    this.setState({ ...this.state, focus: focusedInput }, () => {
      this.setState({ ...this.state, startDate, endDate });
      if (endDate) {
        this.setState({
          clearStart: startDate.format(headFormat),
          clearEnd: endDate.format(headFormat)
        });
      } else {
        this.setState({
          clearStart: startDate.format(headFormat),
          clearEnd: ""
        });
      }
    });
  };
  selectYear = () => {
    this.setState({
      selectState: "year",
      selectedYear: parseInt(this.state.focusedMonth.format("YYYY"))
    });
  };
  selectMonthAndDate = () => {
    this.setState({
      selectState: "monthAndDate"
    });
  };
  changeYear = itemValue => {
    this.setState({ selectedYear: itemValue });
    this.setState({
      focusedMonth: this.state.focusedMonth.year(itemValue),
      currentDate: this.state.currentDate.year(itemValue)
    });
    const defalutFormat =
      !this.props.mode || this.props.mode === "single"
        ? "DD/MM/YYYY"
        : "DD/MM/YYYY";
    const headFormat = this.props.headFormat || defalutFormat;
    this.setState({ clearSingle: this.state.currentDate.format(headFormat) });
  };
  onPressBack = () => {

  }
  render() {
    const markText = this.props.markText || "markText";
    const { customStyles = {} } = this.props;

    const headerContainer = {
      ...styles.headCoverContainer,
      ...customStyles.headerStyle
    };
    const markTitle = {
      ...styles.headTitleText,
      color: "black",
      opacity: 0.8,
      marginBottom: 15,
      fontSize: normalize(18),
      ...customStyles.headerMarkTitle
    };
    const headerDate = {
      ...styles.headTitleText,
      ...customStyles.headerDateTitle
    };
    const headerDateSingle = {
      ...styles.headerDateSingle,
      ...customStyles.headerDateSingle
    };
    return (
      <View>
        <View style={headerContainer}>
          {this.props.mode === "single" && (
            <View>
              <TouchableOpacity onPress={this.props.onPressBack} style={{marginBottom: 15}}>
                <Image source={require("../ArrowLeft.png")} style={{width: 24, height: 24, tintColor: 'white', marginRight: 10}}/>
              </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <Text style={markTitle}>
                  {markText}
                </Text>
              </View>
              <TouchableOpacity onPress={this.selectMonthAndDate}>
                <Text style={headerDateSingle}>
                  {this.state.clearSingle}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {this.props.mode === "range" && (
            <View>
              <TouchableOpacity onPress={this.props.onPressBack} style={{marginBottom: 15}}>
                  <Image source={require("../ArrowLeft.png")} style={{width: 24, height: 24, tintColor: 'white', marginRight: 10}}/>
                </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <Text style={markTitle}>{markText}</Text>
              </View>
              <View style={styles.dateContainer}>
                <Text style={headerDate}>
                  {this.state.clearStart ? this.state.clearStart : (this.props.startDateLabel ? this.props.startDateLabel : "Start Date")}
                </Text>
                <Text style={styles.headTitleText} />
                <Text style={headerDate}>
                  {this.state.clearEnd ? this.state.clearEnd : (this.props.endDateLabel ? this.props.endDateLabel : "End Date")}
                </Text>
              </View>
            </View>
          )}
        </View>
        {this.state.selectState === "monthAndDate" && (
          <View style={styles.calendar}>
            <View style={styles.headActionContainer}>
              <TouchableOpacity onPress={this.previousMonth}>
                <Text
                  style={{
                    paddingHorizontal: 15,
                    fontSize: 18,
                    fontWeight: "bold"
                  }}
                >
                  {"<"}
                </Text>
              </TouchableOpacity>
              <Text
                style={{ fontSize: 20, color: "black", fontWeight: "bold" }}
              >
                {this.state.focusedMonth.format("MM / YYYY")}
              </Text>
              <TouchableOpacity onPress={this.nextMonth}>
                <Text
                  style={{
                    paddingHorizontal: 15,
                    fontSize: 18,
                    fontWeight: "bold"
                  }}
                >
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>
            <Month
              mode={this.props.mode}
              date={this.props.date}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              focusedInput={this.props.focusedInput}
              currentDate={this.state.currentDate}
              focusedMonth={this.state.focusedMonth}
              onDatesChange={this.onDatesChange}
              isDateBlocked={this.props.isDateBlocked}
              onDisableClicked={this.props.onDisableClicked}
              selectedBgColor={this.props.selectedBgColor}
              selectedTextColor={this.props.selectedTextColor}
            />
          </View>
        )}
      </View>
    );
  }
}

DateRange.propTypes = {
  mode: PropTypes.oneOf(["range", "single"]),
  date: PropTypes.instanceOf(moment),
  startDate: PropTypes.instanceOf(moment),
  endDate: PropTypes.instanceOf(moment),
  focusedInput: PropTypes.oneOf(["startDate", "endDate"]),
  onDatesChange: PropTypes.func,
  isDateBlocked: PropTypes.func,
  onDisableClicked: PropTypes.func,
  startDateLabel: PropTypes.string,
  endDateLabel: PropTypes.string,
};
