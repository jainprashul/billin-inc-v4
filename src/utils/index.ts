// This method is created for cross-browser compatibility, if you don't

import { useState } from "react";

// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function URLParamstoObject(params: string) {
  const urlParams = new URLSearchParams(params);
  return Object.fromEntries(urlParams.entries());
}


export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

/**
 * Filter data based on date range
 * @param data 
 * @param startDate 
 * @param endDate 
 * @returns 
 */
export function filterDataByDate(data: any[], startDate: Date, endDate: Date) {
  const filteredData = data.filter(
    (item: any) =>
      new Date(item.date).getTime() >= new Date(startDate).getTime() &&
      new Date(item.date).getTime() <= new Date(endDate).getTime()
  );
  return filteredData;
}


// generate random color 
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// difference between two nested objects
export const objDiff = (updatedObj: any, baseObj: any): any => {
  const keysA = Object.keys(updatedObj);
  const keysB = Object.keys(baseObj);
  const keys = keysA.concat(keysB).filter((key, index, arr) => arr.indexOf(key) === index);
  return keys.reduce((acc: any, key) => {
    if (updatedObj[key] === baseObj[key]) {
      return acc;
    }
    if (typeof updatedObj[key] === 'object' && typeof baseObj[key] === 'object') {
      return [
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...objDiff(updatedObj[key], baseObj[key]).map((item : any, i: any) => `pkey : ${key}, ${item}`)
      ]
    }
    return [...acc, `key : ${key}, updated : ${updatedObj[key]}, orignal : ${baseObj[key]}`];
  }, []);
};

// Pagination
export const arrayToPages = <T>(array: Array<T>, pageSize: number) => {
  const pages = [];
  for (let i = 0; i < array.length; i += pageSize) {
    pages.push(array.slice(i, i + pageSize));
  }
  return {
    pages,
    totalPages: pages.length,
    totalItems: array.length,
  }
};


export const changeURL = (url: string, routeParams : {key : string , value : string}[]) => {

  const urlParams = new URLSearchParams(window.location.search);
  routeParams.forEach((param) => {
    urlParams.set(param.key, param.value);
  });
  url = `${url}?${urlParams.toString()}`;
  
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", url);
  }
}

// get Dates between two dates
export const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates = [];
  const theDate = new Date(startDate);
  while (theDate < endDate) {
    dates.push(new Date(theDate));
    theDate.setDate(theDate.getDate() + 1);
  }
  return dates;
}