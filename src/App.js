import React, {Component} from 'react';
import {Button, Flex} from "antd";
import classes from "./App.module.scss";
import { biometry, init } from '@telegram-apps/sdk';


class App extends Component {
  state = {
    isMount: false,
    notSupport: true,
    isBiometryAccess: false,
    status: "",
    token: "",
  }

  componentDidMount() {
    init()
  }

  check = async () => {
    if (biometry.requestAccess.isAvailable()) {
      const granted = await biometry.requestAccess(); // boolean
      this.setState({ isBiometryAccess: granted });
      await this.authenticate();
    }
  }

  authenticate = async () => {
    if (biometry.authenticate.isAvailable()) {
      const { status, token } = await biometry.authenticate({
        reason: 'Пожалуйста!',
      });

      this.setState({ status, token }); // <-- ключевая строка

      if (status === 'authorized') {
        console.log(`Authorized. Token: ${token}`);
      } else {
        console.log('Not authorized');
      }
    }
  }

  mountBiometry = async () => {
    if (biometry.mount.isAvailable()) {
      try {
        const promise = biometry.mount();
        biometry.isMounting(); // true
        await promise;
        biometry.isMounting(); // false
        biometry.isMounted(); // true
        this.setState({
          isMount: biometry.isMounted(),
        });
      } catch (err) {
        biometry.mountError(); // equals "err"
        biometry.isMounting(); // false
        biometry.isMounted(); // false
        this.setState({
          notSupport: true
        });
      }
    }
  }

  render() {
    const {isMount, isBiometryAccess, status, token, notSupport} = this.state

    return (
      <div className={classes.App}>
        <Flex justify="center" vertical>
          <p>
            <b>STATE:</b> <br/>
            isMount: {isMount.toString()}<br/>
            notSupport: {notSupport.toString()}<br/>
            isBiometryAccess: {isBiometryAccess.toString()}<br/>
            status: {status.toString()}<br/>
            {/*token: {token.length > 0 ? token.slice(0, 10) + '...' : ''}*/}
          </p>
          <Flex gap={20} vertical>
            <Button size="large" onClick={() => this.mountBiometry()}>Смонтировать библиотеку!</Button>
            <Button size="large" onClick={() => this.check()}>Проверить биометрию</Button>
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default App;