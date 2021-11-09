import { BehaviorSubject } from "rxjs"

export const components = ["three-test1", "three-svg-loader1", "three-mountain", "landing-page", "globe-page"]

const selectedSub = new BehaviorSubject<string>("")
export const selectedComponent = selectedSub.asObservable()

export const setSelectedComponent = (comp: string) => {
    selectedSub.next(comp)
}