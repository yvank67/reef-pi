import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import Main from './main'
import AdafruitIO from './adafruit_io'
import Notification from './notification'
import thunk from 'redux-thunk'
import 'isomorphic-fetch'

Enzyme.configure({ adapter: new Adapter() })
const mockStore = configureMockStore([thunk])

describe('Telemetry UI', () => {
  it('<Main />', () => {
    const mailer = {
      port: 546,
      server: 'test.example.com'
    }
    const aio = {
      enable: true,
      user: 'u',
      token: 'foo'
    }
    const telemetry = {
      mailer: mailer,
      throttle: 10,
      adafruitio: aio
    }
    shallow(<Main store={mockStore({})} />)
      .dive()
      .instance()

    const m = shallow(<Main store={mockStore({ telemetry: telemetry })} />)
      .dive()
      .instance()
    m.updateMailer(mailer)
    const fields = ['server', 'password', 'To', 'From']
    fields.forEach(k => {
      var t = {}
      t[k] = ''
      m.updateMailer(t)
    })
    m.updateAio(aio)
    m.updateAio({ enable: false })
    m.updateThrottle({ target: { value: 20 } })
    m.enableMailer({ target: { checked: true } })
    m.save()
    delete m.state.config.adafruitio
    m.showAdafruitIO()
    delete m.state.config.mailer
    m.notification()
    delete m.state.config
    m.showAdafruitIO()
    m.notification()
    m.testMessage()
    m.updateAio({ enable: true, user: '' })
    m.updateAio({ enable: true, user: 'foo', token: '' })
  })

  it('<AdafruitIO />', () => {
    const m = shallow(<AdafruitIO adafruitio={{}} update={() => true} />).instance()
    m.updateEnable({ target: { checked: true } })
    m.onChange('foo')({ target: { value: 1 } })
  })

  it('<Notification />', () => {
    let m = shallow(<Notification update={() => true} mailer={{}} />).instance()
    m.update(1)({ target: { value: 'foo' } })
  })
})
