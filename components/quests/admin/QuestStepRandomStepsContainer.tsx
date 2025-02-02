import { Button } from '@mui/material';
import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';


interface Props {
	isConnectable: boolean;
	data: any;
	id: string; //nodeId
}
const QuestStepRandomStepsContainer = (props: Props) => {
	const nodeId = props.id;
	const data = props.data;
	const stepId = data?.stepId;
	const isConnectable = props.isConnectable;

	
	return (
		<div className="node-default" style={{ textAlign: "left", width: "100%", height: "100%", background: "transparent" }}>


			<Button onClick={() => data.addRandomStepOption(stepId, nodeId)} variant="contained" size="small" style={{ position: "relative" }}>Add</Button>

			<div className="m-t-sm">Random Choices</div>
		</div>
	);
};


export default memo(QuestStepRandomStepsContainer);