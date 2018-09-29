import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import LoginForm from '@/module/form/LoginForm/Container'
import RegisterForm from '@/module/form/RegisterForm/Container'
import I18N from '@/I18N'
import {Tabs, Row, Col} from 'antd'

import './style.scss'

const TabPane = Tabs.TabPane

export default class extends BaseComponent {
    ord_states() {
        return {
            persist: true,
            activeKey: 'login' // login, register, post, login-end
        }
    }

    handleSubmit() {
        const registerRedirect = sessionStorage.getItem('registerRedirect')
        sessionStorage.removeItem('registerRedirect')
        sessionStorage.removeItem('registerWelcome')
        this.props.onHideModal()
        this.props.history.push('/empower35')
    }

    showPostRegLogScreen() {
        return (
            <div className="post-state">
                <h3 className="welcome-header komu-a">{I18N.get('register.welcome')}</h3>
                <div className="strike-text">
                    <div className="strike-line"/>
                    <p className="welcome-text synthese" onClick={this.handleSubmit.bind(this)}>
                        {I18N.get('register.join_circle')}
                    </p>
                </div>
                <img className="arrow-down" src="/assets/images/emp35/down_arrow.png" />
            </div>
        )
    }

    ord_render() {
        if (this.state.activeKey === 'login-end') {
            this.props.onHideModal()
        }
        return (
            <div className="c_LoginOrRegister">
                <div className="side-image">
                    <img src="/assets/images/login-left.png"/>
                </div>
                <div className="main-form">
                    {this.state.activeKey === 'post' ? this.showPostRegLogScreen() : (
                        <Tabs activeKey={this.state.activeKey} onChange={(key) => { this.setState({activeKey: key}) }}>
                            <TabPane tab="Login" key="login">
                                <LoginForm onChangeActiveKey={(key) => { this.setState({activeKey: key}) }}/>
                            </TabPane>
                            <TabPane tab="Register" key="register">
                                <RegisterForm onChangeActiveKey={(key) => { this.setState({activeKey: key}) }}/>
                            </TabPane>
                        </Tabs>)}
                </div>
            </div>
        )
    }
}
