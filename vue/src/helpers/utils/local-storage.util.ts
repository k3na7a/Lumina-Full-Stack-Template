type ILocalStorageUtil = {
  getItem: <T>() => T | null
  saveItem: <T>(data: T) => void
  destroyItem: () => void
}

const useLocalStorageUtil = function ($attr: string): ILocalStorageUtil {
  function getItem<T>(): T | null {
    const item = window.localStorage.getItem($attr)
    if (item) return JSON.parse(item)
    return null
  }

  function saveItem<T>(data: T): void {
    window.localStorage.setItem($attr, JSON.stringify(data))
  }

  function destroyItem(): void {
    window.localStorage.removeItem($attr)
  }

  return {
    getItem,
    saveItem,
    destroyItem
  }
}

export { useLocalStorageUtil }
export type { ILocalStorageUtil }
