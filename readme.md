This is a fork from 'react-native-event-listeners' and converted to ES5 for other javascript enviroments. This library can run on `Nodejs`, `reactjs` and pretty much all JS enviroments.
It started as a fork of `react-native-event-listeners`. Now it is rewritten with Typescript and React Hooks support.

If you use `React`, check out the simple yet powerful hooks and state management at [react.md](./react.md)

## API

```javascript
import GlobalEvent from 'js-events-listener'
// or import { GlobalEvent } from 'js-events-listener'
// or const GlobalEvent = require('js-events-listener');
```

| static method       | return value      | description                                                    |
| :------------------ | :---------------- | :------------------------------------------------------------- |
| addEventListener    | string \| boolean | return value is the id of the event listener or false on error |
| removeEventListener | boolean           | true on success otherwise false                                |
| removeAllListeners  | boolean           | true on success otherwise false                                |
| emitEvent           | void              | no return value                                                |
| on                  | string \| boolean | **shorthand** for addEventListener                             |
| rm                  | boolean           | **shorthand** for removeEventListener                          |
| rmAll               | boolean           | **shorthand** for removeAllListeners                           |
| emit                | void              | **shorthand** for emitEvent                                    |

## Usage
- File `a.js`
```javascript
  import GlobalEvent from 'js-events-listener'
  export const runThis = () => {
    GlobalEvent.emit('some-event-name', { someData: 123 })
  }
```

- File `b.js`
```javascript
  import GlobalEvent from 'js-events-listener'
  export const setupListenerBeforeTheEventEmitted = () => {
    GlobalEvent.on('some-event-name', data => {
      console.log(data); // { someData: 123 }
    })
  }
```

- File `c.js`
```javascript
  import GlobalEvent from 'js-events-listener'
  export const setupListenerBeforeTheEventEmitted = () => {
    const eventId = GlobalEvent.on('some-event-name', data => {
      console.log(data); // { someData: 123 }
    });

    // remove listener
    GlobalEvent.rm(eventId);
  }
```

- File `d.ts`
```javascript
  import GlobalEvent from 'js-events-listener'

  type PayloadData {
    someData: number,
  }

  export const setupListenerBeforeTheEventEmitted = () => {
    const eventId = GlobalEvent.on<PayloadData>('some-event-name', data => {
      console.log(data); // { someData: 123 }, as PayloadData
    });

    // remove listener
    GlobalEvent.rm(eventId);
  }
```