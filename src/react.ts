import { useEffect, useState, useRef } from 'react';
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
  const valueRef = useRef(initialValue);
  const [value, setValue] = useState(valueRef.current);
  useEffect(() => {
    GlobalEvent.emit('GLOBAL_STATE_'+uniqueId, value);
  }, [value]);
  useEvent<T>('GLOBAL_STATE_'+uniqueId, (newValue) => {
    if (value !== newValue) {
      setValue(newValue);
      valueRef.current = newValue;
    }
  }, [value]);
  return [value, setValue];
}

type TValueType = 'string' | 'number' | 'object'

export interface ILocalStorage {
  getItem(id: string, type: TValueType): null | any,
  setItem(id: string, value: any, type: TValueType): void,
}

export const makePersistState = ({ getItem, setItem } : ILocalStorage) => <T>(initialValue : T, uniqueId : string, type : TValueType) => {
  const valueRef = useRef(initialValue);
  const [isReady, setIsReady] = useGlobalState(false, `${uniqueId}-is-ready`);
  const [value, setValue] = useGlobalState<T>(valueRef.current, uniqueId);
  const getInitialData = async () => {
    const localValue = await getItem(uniqueId, type);
    if (localValue !== null) {
      setValue(localValue);
      setIsReady(true);
      valueRef.current = localValue;
    }
  }
  useEffect(() => {
    if (isReady) return;
    getInitialData();
  }, [])
  useEffect(() => {
    setItem(uniqueId, value, type);
  }, [value])
  return [value, setValue, isReady];
}

export default GlobalEvent;