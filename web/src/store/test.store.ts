import { Store, StoreDefinition, defineStore } from 'pinia'

interface ITestState {
  count: number
}

interface TestGetters {
  doubleCount: (state: ITestState) => number
}
interface TestActions {
  reset(): void
}

type TestStore = Store<'test', ITestState, TestGetters, TestActions>
type StoreDef = StoreDefinition<'test', ITestState, TestGetters, TestActions>

const useTestStore: StoreDef = defineStore({
  id: 'test',
  state: (): ITestState => ({
    count: 0
  }),
  getters: {
    doubleCount: (state: ITestState): number => state.count * 2
  },
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    reset(): void {
      this.count = 0
    }
  }
})

export { useTestStore }
export type { TestStore }
