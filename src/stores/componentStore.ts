import { BehaviorSubject } from "rxjs"

const comps = ["three-test1", "three-svg-loader1"]
const componentsSub = new BehaviorSubject<string[]>(comps)
export const components = componentsSub.asObservable()

const selectedSub = new BehaviorSubject<string>("")
export const selectedComponent = selectedSub.asObservable()

export const setSelectedComponent = (comp: string) => {
    selectedSub.next(comp)
}