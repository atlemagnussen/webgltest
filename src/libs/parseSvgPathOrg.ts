type PathCommand = "a"|"c"|"h"|"l"|"m"|"q"|"s"|"t"|"v"|"z"
interface PathCommandLengths extends Record<PathCommand, number> {}

var commandLengths: PathCommandLengths = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}
var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
export function parse(path: string) {
	var data: Array<Array<string | number>> = []
    
	path.replace(segment,
        // @ts-ignore
        function(substring: string, command: string, args: string) {
            let type = command.toLowerCase() as PathCommand
            let argsNum = parseValues(args)

            // overloaded moveTo
            if (type == 'm' && argsNum.length > 2) {
                let arr = [command, ...argsNum.splice(0, 2)]
                data.push(arr)
                type = 'l'
                command = command == 'm' ? 'l' : 'L'
            }

            while (true) {
                if (argsNum.length == commandLengths[type]) {
                    let arr = [command, ...argsNum]
                    return data.push(arr)
                }
                if (argsNum.length < commandLengths[type])
                    throw new Error('malformed path data')
                let arr = [command, ...argsNum.splice(0, commandLengths[type])]
                data.push(arr)
            }
        }
    )
	return data
}

var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

function parseValues(args: string) {
	var numbers = args.match(number)
	return numbers ? numbers.map(Number) : []
}
