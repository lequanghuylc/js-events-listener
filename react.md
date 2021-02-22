
Take a look at `./src/react.ts` to see the code snippet is really short & simple, but it can do alot of things.

## Event Hooks

```javascript
import React, { useState } from 'react';
import GlobalEvent, { useEvent } from 'js-events-listener/react';

// Button.js

export const Button = ({ someData }) => {
  return (
    <button onClick={() => GlobalEvent.emit('BUTTON_CLICKED', someData)}>
      Click Me
    </button>
  );
}

// OtherComponentInDifferentTreeBranch.js

export const OtherComponentInDifferentTreeBranch = () => {
  const [data, setData] = useState({});
  useEvent('BUTTON_CLICKED', (someData) => {
    setData(someData);
  }, []);
  return (
    <pre>
      {JSON.stringify(data, undefined, 4)}
    </pre>
  );
}

```

## Shared State, a.k.a Global State

It's using `useState` under the hood and emit an Global Event everytime the value is changed, so other React components that have that state can re-render.

```javascript
import React, { useState } from 'react';
import GlobalEvent, { useGlobalState } from 'js-events-listener/react';

// Counter.js

export const Counter = () => {
  const [count, setCount] = useGlobalState(0, 'countState');
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count+1))}>
        Increase
      </button>
    </div>
  );
}

// OtherCounterButShareSameValue.js

export const OtherCounterButShareSameValue = () => {
  const [count, setCount] = useGlobalState(0, 'countState');
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count-1))}>
        Decrease
      </button>
    </div>
  );
}

// both count numbers here are the same value with each other
export const Screen = () => (
  <>
    <Counter />
    <OtherCounterButShareSameValue />
  </>
)

```

## State Management

With the usage of `useGlobalState`, we can export the Global State code blocks to separate files. It now becomes a state management library.

```javascript
import React, { useState } from 'react';
import GlobalEvent, { useGlobalState } from 'js-events-listener/react';

export const useUserStore = () => {
  const [user, setUser] = useGlobalState({}, 'userStore');
  const login = async (user, password) => {

  };
  const logout = async () => {

  };
  const getInfo = async () => {
    
  };
  return [
    user,
    {
      login,
      logout,
      getInfo,
    }
  ]
}
```

### Persisted value

The idea here is to let developers implement their own `getItem` and `setItem` to make the library cross-platform. For example, `localStorage` for web and `AsyncStorage` for `react-native`. We can totally add data encryption to prevent unwanted storage data leaking.

```javascript
import React, { useState } from 'react';
import GlobalEvent, { useGlobalState, makePersistState } from 'js-events-listener/react';

const getItem = async (name, type) => {
  const item = localStorage.getItem(name);
  if (item === null) return null;
  switch(type) {
    case 'number': return Number(item);
    case 'string': return item === 'null' ? null : item;
    case 'object': 
      try {
        return JSON.parse(item);
      } catch(err) {
        return null;
      }
    default: return null;
  }
}
const setItem = async (name, value, type) => {
  localStorage.setItem(name, JSON.stringify(value));
}

const useGlobalPersistState = makePersistState({ getItem, setItem });

export const useUserStore = () => {
  const [user, setUser] = useGlobalPersistState({}, 'userStore');
  const login = async (user, password) => {

  };
  const logout = async () => {

  };
  const getInfo = async () => {
    
  };
  return [
    user,
    {
      login,
      logout,
      getInfo,
    }
  ]
}
```
```