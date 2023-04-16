import {
	Machine,
	print,
	registerMethods,
	repeatArray,
	Stage,
} from "../libraries/habitat-import.js"
import { ArrowOfConnection } from "./entities/arrows/tickler/connection.js"
import { ArrowOfCreation } from "./entities/arrows/tickler/creation.js"
import { ArrowOfDestruction } from "./entities/arrows/tickler/destruction.js"
import { Camera } from "./entities/camera.js"
import { Display } from "./entities/display.js"
import { registerDebugs } from "./input/debug.js"
import { getHover } from "./input/hover.js"
import { connectMachine } from "./input/machine.js"
import { getPointer } from "./input/pointer.js"
import { registerPreventDefaults } from "./input/prevent.js"
import { Idle } from "./input/states.js"
import { registerWheel } from "./input/wheel.js"

//===============//
// Setup Habitat //
//===============//
window.print = print
window.dir = console.dir.bind(console)
registerMethods()

//==============//
// Setup Engine //
//==============//
const stage = new Stage({
	context: { background: "2d", html: "html", svg: "svg", foreground: "2d" },
})

const display = new Display(stage)
const camera = new Camera()
display.add(camera)
display.input = camera.input

const machine = new Machine()
const pointer = getPointer(camera)
const hover = getHover(camera)

export const shared = {
	stage,
	camera,
	machine,
	pointer,
	hover,
	display,
	time: performance.now(),
}

// Set default zoom
camera.transform.scale = repeatArray([5], 2)

// Register inputs
connectMachine(machine)
machine.set(Idle)
registerWheel()
registerPreventDefaults()
registerDebugs(false)

//===============//
// Setup Arroost //
//===============//
const arrowOfDestruction = new ArrowOfDestruction()
camera.add(arrowOfDestruction)
arrowOfDestruction.transform.position = [
	((innerWidth / camera.transform.scale.x) * 1) / 3,
	innerHeight / 2 / camera.transform.scale.y,
]

const arrowOfCreation = new ArrowOfCreation()
camera.add(arrowOfCreation)
arrowOfCreation.transform.position = [
	((innerWidth / camera.transform.scale.x) * 2) / 3,
	innerHeight / 2 / camera.transform.scale.y,
]

const arrowOfConnection = new ArrowOfConnection()
camera.add(arrowOfConnection)
arrowOfConnection.transform.position = [
	innerWidth / 2 / camera.transform.scale.x,
	innerHeight / 2 / camera.transform.scale.y,
]

//=================//
// Setup Debugging //
//=================//
Object.assign(window, shared)
