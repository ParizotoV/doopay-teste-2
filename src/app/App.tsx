import React, { useState } from 'react';

type Points = {
	x: number;
	y: number;
	color: number;
};

interface CircleProps {
	x: number;
	y: number;
	number: number;
	color: number;
}

const Circle: React.FC<CircleProps> = ({ number, x, y, color }) => {
	const Colors = ['bg-red-600', 'bg-neutral-600', 'bg-green-600'];
	return (
		<div
			className={`w-[12px] h-[12px] text-[8px] absolute ${Colors[color]} text-white rounded rounded-full font-bold text-center`}
			style={{ left: x, top: y }}>
			{number}
		</div>
	);
};

const App: React.FC = () => {
	const [points, setPoints] = useState<Points[]>([]);

	const [undo, setUndo] = useState<Points[]>([]);

	const [redo, setRedo] = useState<Points[]>([]);

	const updatePoint = (x: number, y: number, color: number) => {
		const indice = points.findIndex(
			find => find.x === x && find.y === y && find.color === color,
		);

		setPoints(prevState => {
			const copia = [...prevState];

			copia[indice].color = color !== 2 ? color + 1 : 0;

			return [...copia];
		});
	};

	const addPoint = (x: number, y: number) => {
		const algum = points.filter(prop => {
			if (x >= prop.x && x <= prop.x + 12 && y >= prop.y && y <= prop.y + 12) {
				return true;
			}
			return false;
		});

		if (algum.length > 0) {
			updatePoint(algum[0].x, algum[0].y, algum[0].color);
		} else {
			setRedo([]);
			setUndo([]);

			setPoints(prevState => [...prevState, { x, y, color: 0 }]);
		}
	};

	const handleRedo = () => {
		const newArray = points;
		const newArrayUndo = undo;

		const item = newArrayUndo.shift();

		if (item !== undefined) {
			setPoints(prevState => [...prevState, item]);
			setUndo(newArrayUndo);
		}
	};

	const handleUndo = () => {
		const newArray = points;

		const item = newArray.pop();

		if (item !== undefined) {
			setPoints(newArray);
			setUndo(prevState => [...prevState, item]);
		}
	};

	return (
		<main>
			<div
				className="w-full"
				style={{ height: 'calc(100vh - 48px)' }}
				onClick={event => addPoint(event.clientX, event.clientY)}>
				{points.map(({ x, y, color }, index) => (
					<Circle number={index + 1} x={x} y={y} color={color} key={index} />
				))}
			</div>

			<button
				{...(undo.length > 0 && { onClick: () => handleRedo() })}
				className={`absolute bottom-0 right-0 p-3 font-bold ${
					undo.length > 0
						? 'bg-neutral-300 text-black'
						: 'bg-neutral-100 text-neutral-300'
				}`}>
				REDO
			</button>
			<button
				{...(points.length > 0 && { onClick: () => handleUndo() })}
				className={`absolute bottom-0 left-0 p-3 font-bold ${
					points.length > 0
						? 'bg-neutral-300 text-black'
						: 'bg-neutral-100 text-neutral-300'
				}`}>
				UNDO
			</button>
		</main>
	);
};

export default App;
