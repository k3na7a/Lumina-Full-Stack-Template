type IPluralize = { value: number; word: string; plural?: string }
type IUseStringUtil = {
  dehash: (payload: string) => string
  capitalize: (payload: string) => string
  pluralize: (payload: IPluralize) => string
}

function useStringUtil(): IUseStringUtil {
  function dehash(payload: string): string {
    return payload.replace(/^#/, '')
  }

  function capitalize(payload: string): string {
    return payload[0].toUpperCase() + payload.slice(1)
  }

  function pluralize({ value, word, plural = word + 's' }: IPluralize): string {
    if (value == 1) return word
    return plural
  }

  return {
    dehash,
    capitalize,
    pluralize
  }
}

export { useStringUtil }
