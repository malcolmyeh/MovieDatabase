import React, { Component } from "react";

export default class FadeIn extends Component {
  constructor() {
    super();
    this.state = {
      maxIsVisible: 0,
    };
  }

  componentDidMount() {
    const count = React.Children.count(this.props.children);
    let i = 0;
    this.interval = setInterval(() => {
      i++;
      if (i > count) clearInterval(this.interval);

      this.setState({ maxIsVisible: i });
    }, 50);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const transitionDuration = 400;
    const WrapperTag = this.props.wrapperTag || "div";
    const ChildTag = this.props.childTag || "div";

    return (
      <WrapperTag className={this.props.className}>
        {React.Children.map(this.props.children, (child, i) => {
          return (
            <ChildTag
              className={this.props.childClassName}
              style={{
                transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
                transform: `translateY(${
                  this.state.maxIsVisible > i ? 0 : 20
                }px)`,
                opacity: this.state.maxIsVisible > i ? 1 : 0,
              }}
            >
              {child}
            </ChildTag>
          );
        })}
      </WrapperTag>
    );
  }
}
