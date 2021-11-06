declare module "parse-svg-path"

declare function parse(svgPath: string): Array<Array<string|number>>
export default parse