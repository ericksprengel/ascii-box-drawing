import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Line, Rect, Shape, Text, Circle } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node'

/**
 * it should be Brick XD, because you can't do everything like an
 * adobe does.
 * Why XD? The Experience is not so good, it's just a smille XD
 * There is only one thing that reminds me a designer...
 * The code. The code looks like it was developed by a desiner.
 * 
 */


const INITIAL_TABLE = [
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
].map((line) => Array.from(line))
 
//  const INITIAL_TABLE = [
//   ' ┌────────────────────────────────────────────┐',
//   ' │  ┌───┐ Cardápio                            │▒',
//   ' │  │   │                                     │▒',
//   ' │  │ 1 │ Frango à Parmegiana                 │▒',
//   ' │  │   │ Guarnição: Arroz Branco e Feijão    │▒',
//   ' │  │   │ Mistura: Filé de frango à parmegiana│▒',
//   ' │  │   │ Acompanhamento: Purê de batata      │▒',
//   ' │  └─┬─┘                                     │▒',
//   ' ├─┬──┴──┬────────────────────────────────────┤▒',
//   ' │ │     │ ▄▄▄▄▄▄▄  ▄ ▄▄ ▄▄▄▄▄▄▄              │▒',
//   ' │ │     │ █ ▄▄▄ █ ██ ▀▄ █ ▄▄▄ █              │▒',
//   ' │ │     │ █ ███ █ ▄▀ ▀▄ █ ███ █              │▒',
//   ' │ │     │ █▄▄▄▄▄█ █ ▄▀█ █▄▄▄▄▄█              │▒',
//   ' │ │     │ ▄▄ ▄  ▄▄▀██▀▀ ▄▄▄ ▄▄               │▒',
//   ' │ │     │ ▄▄▀ █ ▄▄ ▄▄ ▄▄▀▀ ▄▄▀█              │▒',
//   ' │ │     │ █ ▄▀█ ▄▀▄█ ▀▄ ▄ ▄  ██              │▒',
//   ' │ │     │ ▄▄▄▄▄▄▄ █▀▀▀ ▄ ▀▄█▄█               │▒',
//   ' │ │     │ █ ▄▄▄ █  ▄▀█▀▀▄▄█ ▄ █              │▒',
//   ' │ │     │ █ ███ █ ▀ █▀▄  ██▄▄▀█              │▒',
//   ' │ │     │ █▄▄▄▄▄█ █▀▀▄▄▀▀▄▀▄ ▄               │▒',
//   ' │ ├──┬──┤  ┌┬┐                               │▒',
//   ' │ └──┴──┘  ├┼┤                               │▒',
//   ' └──────────┴┴┴───────────────────────────────┘▒',
// ].map((line) => Array.from(line))

// const INITIAL_TABLE = [
//  ' ┌───────────────────┐ ',
//  ' │  ╔═══╗ Some Text  │▒',
//  ' │  ╚═╦═╝ in the box │▒',
//  ' ╞═╤══╩══╤═══════════╡▒',
//  ' │ ├──┬──┤  ┌┬┐      │▒',
//  ' │ └──┴──┘  ├┼┤      │▒',
//  ' └──────────┴┴┴──────┘▒',
// ].map((line) => Array.from(line))

const CELL_WIDTH = 25
const CELL_HEIGHT = 51

type BoxChar = '┌' |'├' |'└' |'┬' |'┼' |'┴' |'┐' |'┤' |'┘' |'─' |'│'
type Char = BoxChar | string

interface Point {
  x: number
  y: number
}

const isPointEqual = (p1?: Point, p2?: Point): boolean =>
  Boolean(p1 && p2 && p1.x === p2.x && p1.y === p2.y)

type BxdMouseEvent = KonvaEventObject<MouseEvent>
type OnEventCallback = (point: Point, e: BxdMouseEvent) => void

interface CellProps {
  char?: string
  point: Point
  selected: boolean
  onMouseDown: OnEventCallback
  onMouseOver: OnEventCallback
  onMouseUp: OnEventCallback
  onDblClick: OnEventCallback
}

const Cell: React.FC<CellProps> = ({
  char = '',
  point,
  selected,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onDblClick,
}) => {
  return (
    <>
    <Rect
      x={point.x*CELL_WIDTH}
      y={point.y*CELL_HEIGHT}
      width={CELL_WIDTH}
      height={CELL_HEIGHT}
      fill={selected ? '#ddd' : '#fff'}
    />
    <Circle
      x={point.x*CELL_WIDTH}
      y={point.y*CELL_HEIGHT}
      radius={1}
      fill={'#888'}
    />
      <Text
        fontSize={40}
        fontFamily="Courier"
        text={char}
        x={point.x*CELL_WIDTH}
        y={point.y*CELL_HEIGHT}
        fill="#000"
        width={CELL_WIDTH}
        height={CELL_HEIGHT}
        align="center"
        verticalAlign="middle"
        onMouseDown={(evt) => onMouseDown(point, evt)}
        onMouseOver={(evt) => onMouseOver(point, evt)}
        onMouseUp={(evt) => onMouseUp(point, evt)}
        onDblClick={(evt) => onDblClick(point, evt)}
      />
    </>
  )
}


const BOX_CHARS: BoxChar[] = [
  '┌',
  '├',
  '└',
  '┬',
  '┼',
  '┴',
  '┐',
  '┤',
  '┘',
  '─',
  '│',
]
// up right down left
const BOX_CHARS_PROPS: Record<BoxChar, number> = {
  '┌': 0b0110,
  '├': 0b1110,
  '└': 0b1100,
  '┬': 0b0111,
  '┼': 0b1111,
  '┴': 0b1101,
  '┐': 0b0011,
  '┤': 0b1011,
  '┘': 0b1001,
  '─': 0b0101,
  '│': 0b1010,
}
const BOX_CHARS_FROM_PROPS: Record<number, BoxChar> = {
  0b0110: '┌',
  0b1110: '├',
  0b1100: '└',
  0b0111: '┬',
  0b1111: '┼',
  0b1101: '┴',
  0b0011: '┐',
  0b1011: '┤',
  0b1001: '┘',
  0b0101: '─',
  0b1010: '│',
}
const isBoxChar = (char: Char): boolean => BOX_CHARS.includes(char as BoxChar)

function App() {
  const [startPoint, setStartPoint] = useState<Point>()
  const [endPoint, setEndPoint] = useState<Point>()
  const [selectedPoint, setSelectedPoint] = useState<Point>()

  const [shiftKeyPressed, setShiftKeyPressed] = useState(false)
  const [altKeyPressed, setAltKeyPressed] = useState(false)
  const [table, setTable ] = useState<string[][]>(INITIAL_TABLE)

  const mergeChars = (char1: Char, char2: BoxChar): Char => {
    if (!isBoxChar(char1)) {
      return !shiftKeyPressed || char1 === ' '
        ? char2
        : char1
    }
    return BOX_CHARS_FROM_PROPS[
      BOX_CHARS_PROPS[char1 as BoxChar] | BOX_CHARS_PROPS[char2]
    ]
  }
  const getChar = (point: Point, char: Char) => {
    if (!startPoint || !endPoint) {
      return char
    }

    const boxChars: BoxChar[][] = [
      ['┌','─','┐'],
      ['│','┼','│'],
      ['└','─','┘'],
    ]
    if (
      point.y >= startPoint.y && point.y <= endPoint.y
      && point.x >= startPoint.x && point.x <= endPoint.x
    ) {
      if (point.x === startPoint.x && point.y === startPoint.y) {
        return mergeChars(char, boxChars[0][0])
      }
      if (point.x === startPoint.x && point.y === endPoint.y) {
        return mergeChars(char, boxChars[2][0])
      }

      if (point.x === endPoint.x && point.y === startPoint.y) {
        return mergeChars(char, boxChars[0][2])
      }
      if (point.x === endPoint.x && point.y === endPoint.y) {
        return mergeChars(char, boxChars[2][2])
      }

      if (
        (point.x === startPoint.x || point.x === endPoint.x)
        && point.y < endPoint.y
      ) {
        return mergeChars(char, '│')
      }
      if (
        (point.y === startPoint.y || point.y === endPoint.y)
        && point.x < endPoint.x
      ) {
        return mergeChars(char, '─')
      }
    }
    return char
  }

  const handleOnMouseDown = (point: Point) => {
    setStartPoint(point)
  }
  const handleOnMouseOver = (point: Point, evt: BxdMouseEvent) => {
    if (startPoint) {
      setEndPoint(point)
    }
  }
  const handleOnMouseUp = (point: Point) => {
    if (isPointEqual(startPoint, point)) {
      setSelectedPoint(point)
    } else {
      setTable(table.map((row, y) => row.map(
        (char, x) => getChar({x,y}, char)
      )))
    }
    
    setStartPoint(undefined)
    setEndPoint(undefined)
  }

  const handleOnDblClick = (point: Point) => {
    isPointEqual(point, selectedPoint)
      ? setSelectedPoint(undefined)
      : setSelectedPoint(point)
  }

  const handleOnKeyDown = (evt: React.KeyboardEvent) => {
    evt.preventDefault()
    console.log(evt.key)
    if (evt.key === 'Shift') {
      setShiftKeyPressed(true)
    }
    if (evt.key === 'Alt') {
      setAltKeyPressed(true)
    }
  }

  const handleOnKeyUp = (evt: React.KeyboardEvent) => {
    evt.preventDefault()
    if (evt.key === 'Shift') {
      setShiftKeyPressed(false)
    }
    if (evt.key === 'Alt') {
      setAltKeyPressed(false)
    }

    if (!selectedPoint) {
      return
    }


    if (evt.key === 'Delete' || evt.key === 'Backspace' || evt.key === 'ArrowLeft') {
      setSelectedPoint({
        y: selectedPoint.y,
        x: selectedPoint.x - 1,
      })
      return
    }

    if (evt.key === 'ArrowRight') {
      setSelectedPoint({
        y: selectedPoint.y,
        x: selectedPoint.x + 1,
      })
      return
    }

    if (evt.key === 'ArrowUp') {
      setSelectedPoint({
        y: selectedPoint.y - 1,
        x: selectedPoint.x,
      })
      return
    }

    if (evt.key === 'ArrowDown') {
      setSelectedPoint({
        y: selectedPoint.y + 1,
        x: selectedPoint.x,
      })
      return
    }

    const ignoredKeys = ['Enter', 'Shift', 'Alt']

    if (!ignoredKeys.includes(evt.key)) {

      const t2 = [
        ...table,
      ]
      t2[selectedPoint.y][selectedPoint.x] = evt.key
      setTable(t2)
      setSelectedPoint({
        y: selectedPoint.y,
        x: selectedPoint.x + 1
      })
      console.log(t2.reduce(
        (acc, line) => acc + '\n' + line.join(''),
        ''
      ))
    }
  }

  return (
    <div tabIndex={1} onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp}>
      <Stage width={window.innerWidth} height={window.innerHeight} onKey>
        <Layer>
          {table.map((row, y) => row.map((char, x) => (
            <Cell
              char={getChar({x, y}, char)} point={{x, y}}
              selected={isPointEqual({x, y}, selectedPoint)}
              onMouseDown={handleOnMouseDown}
              onMouseOver={handleOnMouseOver}
              onMouseUp={handleOnMouseUp}
              onDblClick={handleOnDblClick}
            />))
          )}
        </Layer>
      </Stage>
    </div>

        // <pre>
        // ┌───────────────────┐ {'\n'}
        // │  ╔═══╗ Some Text  │▒{'\n'}
        // │  ╚═╦═╝ in the box │▒{'\n'}
        // ╞═╤══╩══╤═══════════╡▒{'\n'}
        // │ ├──┬──┤           │▒{'\n'}
        // │ └──┴──┘           │▒{'\n'}
        // └───────────────────┘▒{'\n'}
        // </pre>
  );
}

export default App;
