import ReactFlow, {
    addEdge,
    Background,
    removeElements,
} from "react-flow-renderer";
import ConstantBlock from "../blocks/blk_constant";
import GaugeBlock from "../blocks/blk_gauge";
import PlusBlock from "../blocks/blk_plus";
import { NAME_TYPE } from "../block_system/blockType";
const nodeTypes = {
    [NAME_TYPE.IN_CONSTANT]: ConstantBlock,
    [NAME_TYPE.OP_SUM]: PlusBlock,
    [NAME_TYPE.OUT_NUMBER_DISPLAY]: GaugeBlock,
};

const Diagram = (props) => {
    const { elements, setElements } = props;

    const onElementClick = (event, element) => console.log("click", element);
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onConnect = (params) => {
        if (params.sourceHandle.split[0] == params.targetHandle.split[0]) {
            // console.log("on connect", getIntFromString(params.targetHandle));
            setElements((els) =>
                addEdge(
                    {
                        ...params,
                        type: "smoothstep",
                        style: { stroke: "#333" },
                        arrowHeadType: "arrowclosed",
                        animated: true,
                        connectionMode: "loose",
                        flag: "line",
                    },
                    els
                )
            );
            console.log("Successfully Connected !");
        } else {
            console.log("Wrong Connection");
        }
    };

    return (
        <div style={{ height: 650, width: 1000 }}>
            <ReactFlow
                snapToGrid={true}
                snapGrid={[10, 10]}
                elements={elements}
                nodeTypes={nodeTypes}
                onElementsRemove={onElementsRemove}
                onElementClick={onElementClick}
                onConnect={onConnect}
                connectionLineType={"smoothstep"}
                connectionLineStyle={{ stroke: "#333" }}
            >
                <Background variant="dots" gap={10} size={0.5} />
            </ReactFlow>
        </div>
    );
};

export default Diagram;
