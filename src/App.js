import React, {Component} from 'react';
import {Button, Flex} from "antd";
import classes from "./App.module.scss";
import { biometry } from '@telegram-apps/sdk';


class App extends Component {
  state = {
    isMount: false,
    notSupport: false,
    isBiometryAccess: false,
    status: false,
    token: false,
  }

  render() {
    const {isMount, isBiometryAccess, status, token, notSupport} = this.state

    const check = async () => {
      if (biometry.requestAccess.isAvailable()) {
        const granted = await biometry.requestAccess(); // boolean
        this.setState({isBiometryAccess: granted});
        await authenticate()
      }
    }

    const authenticate = async () => {
      if (biometry.authenticate.isAvailable()) {
        const { status, token } = await biometry.authenticate({
          reason: 'Please!',
        });

        this.setState({
          status
        })
        if (status === 'authorized') {
          this.setState({
            token
          })
        } else {
          console.log('Not authorized');
        }
      }
    }

    const mountBiometry = async () => {
      if (biometry.mount.isAvailable()) {
        try {
          const promise = biometry.mount();
          biometry.isMounting(); // true
          await promise;
          biometry.isMounting(); // false
          biometry.isMounted(); // true
          this.setState({
            isMount: biometry.isMounted(),
            notSupport: true
          })

        } catch (err) {
          biometry.mountError(); // equals "err"
          biometry.isMounting(); // false
          biometry.isMounted(); // false
          console.log("Error", biometry.isMounted())
        }
      } else {

      }
    }

    mountBiometry()

    return (
      <div className={classes.App}>
        <Flex justify="center" vertical>
          <p>
            <b>STATE:</b> <br/>
            isMount: {this.state.isMount}<br/>
            notSupport: {this.state.notSupport}<br/>
            isBiometryAccess: {this.state.isBiometryAccess}<br/>
            status: {this.state.status}<br/>
            token: {this.state.token}
          </p>
          <p>
            {notSupport ? "Биометрия поддерживается" : "Биометрия не поддерживается"}<br/>
            {isMount ? "Компонент смонтирован" : "Компонент не смонтирован"}<br/>
            {isBiometryAccess && "Доступ к биометрии доступен"}<br/>
            {status && ("Статус: " + status)}<br/>
            {token && ("Токен: " + token)}
          </p>
          <Button onClick={check}>Проверить биометрию</Button>
        </Flex>
      </div>
    );
  }
}

export default App;