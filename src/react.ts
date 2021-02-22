import { useEffect, useRef, useState } from 'react';
import GlobalEvent, { ICallback } from './';

export const useEvent = <T>(name : string, callback : ICallback<T>, arrayOfState : Array<any>) : void => {
  const listenerRef = useRef('');
  useEffect(() => {
    let eventId =  GlobalEvent.on(name, callback);
    if (typeof eventId !== 'string') return;
    listenerRef.current = eventId;
    return () => {
      GlobalEvent.rm(listenerRef.current);
    };
  }, arrayOfState);
};

export const useGlobalState = <T>(initialValue : T, uniqueId : string) : [T, (v: T) => void] => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    GlobalEvent.emit('GLOBAL_STATE_'+uniqueId, value);
  }, [value]);
  useEvent<T>('GLOBAL_STATE_'+uniqueId, (newValue) => {
    if (value !== newValue) {
      setValue(newValue);
    }
  }, [value]);
  return [value, setValue];
}

type TValueType = 'string' | 'number' | 'object'

export interface ILocalStorage {
  getItem(id: string, type: TValueType): null | any,
  setItem(id: string, value: any, type: TValueType): void,
}

export const makePersistState = ({ getItem, setItem } : ILocalStorage) => async <T>(initialValue : T, uniqueId : string, type : TValueType) => {
  const persistValue = await getItem(uniqueId, type) as null | T;
  const [value, setValue] = useGlobalState<T>(persistValue === null ? initialValue : persistValue, uniqueId);
  useEffect(() => {
    setItem(uniqueId, value, type);
  }, [value])
  return [value, setValue];
}

export default GlobalEvent;