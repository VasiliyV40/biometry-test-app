import React, { Component } from 'react';
import { Button, Flex } from "antd";
import { biometry, init } from '@telegram-apps/sdk';

class App extends Component {
  state = {
    isMounted: false,
    isBiometryAvailable: false,
    status: null,
    token: null,
  };

  componentDidMount() {
    init();
  }

  checkBiometry = async () => {
    if (biometry.requestAccess.isAvailable()) {
      const granted = await biometry.requestAccess();
      this.setState({ isBiometryAvailable: granted });
      if (granted) {
        await this.authenticate();
      }
    }
  };

  authenticate = async () => {
    if (biometry.authenticate.isAvailable()) {
      try {
        const { status, token } = await biometry.authenticate({
          reason: 'Подтвердите вход',
        });

        this.setState({ status });
        if (status === 'authorized') {
          this.setState({ token });
        } else {
          console.log('Статус:', status);
        }
      } catch (error) {
        console.error('Ошибка аутентификации:', error);
      }
    }
  };

  render() {
    const { isMounted, isBiometryAvailable, status, token } = this.state;

    return (
      <div>
        <Flex justify="center" vertical>
          <p>
            <b>Состояние:</b><br />
            Биометрия доступна: {isBiometryAvailable.toString()}<br />
            Статус: {status || 'неизвестно'}<br />
            Токен: {token || 'нет'}
          </p>
          <Flex gap={20} vertical>
            <Button onClick={this.checkBiometry}>Проверить биометрию</Button>
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default App;