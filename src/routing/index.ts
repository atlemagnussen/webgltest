

import pathBreaker from "@app/funcs/pathBreaker"
import {curRoutePath} from "@app/routing/router"
import { components, setSelectedComponent } from "@app/stores/componentStore"

const findRoute = async (fullpath: string) => {
    const bRoute = pathBreaker.getRoute(fullpath)
    
    if (components.some(c => c == bRoute.path))
        setSelectedComponent(bRoute.path)
}

curRoutePath.subscribe(async path => {
    await findRoute(path)
})
