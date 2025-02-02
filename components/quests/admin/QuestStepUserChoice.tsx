import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';


interface Props {
	isConnectable: boolean;
	data: any;
	id: string; //nodeId
}
const QuestStepUserChoice = (props: Props) => {
	const nodeId = props.id;
	const data = props.data;
	const isConnectable = props.isConnectable;

	
	return (
		<div className="node-default" style={{ textAlign: "left", width: "100%", height: "100%", background: "transparent" }}>
			<div className="m-t-dmd">
				Choice Text
			</div>
			<input
				className="nodrag"
				type="text"
				onChange={(e) => data.onStepChoiceTextChange(e, nodeId)}
				defaultValue={data.choiceText}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={`${nodeId}_choice_right`}
				style={{ top: 10, background: '#555' }}
				isConnectable={isConnectable}
			/>
		</div>
	);
};


export default memo(QuestStepUserChoice);