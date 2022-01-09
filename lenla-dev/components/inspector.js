import * as Block from "../block_system/systemObj";
import { Children, useEffect, useState } from "react";
import styled from "styled-components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
    CANVAS_DISPLAY_TYPE,
    INS_DISPLAY_TYPE,
} from "../block_system/stringConfig";
import { BLOCK_TYPE } from "../block_system/stringConfig";
import InputColor from "react-input-color";

function PortsEdit(props) {
    const { elements, setElements, element, i } = props;

    function updateElementById(id, newElementVal) {
        let items = [...elements];
        const index = elements.findIndex((x) => x.id === id);
        items[index] = newElementVal;
        setElements(items);
    }

    const config = Block.blockConfig(element.type);

    if (config.choice) {
        const options = config.choice;
        const defaultOption = options[0];
    }
    const [portChoice, setPortChoice] = useState(element.data.port.in[i]);
    const [portEnable, setPortEnable] = useState(element.data.port.inEnable[i]);
    const [portDisableValue, setPortDisableValue] = useState(0);
    useEffect(() => {
        element.data.port.inEnable[i] = portEnable;
        if (portEnable && !options.includes(portChoice)) {
            element.data.port.in[i] = defaultOption;
            setPortChoice(defaultOption);
        } else if (!portEnable && options.includes(portChoice)) {
            element.data.port.in[i] = 0;
            setPortChoice(0);
        }
        updateElementById(element.id, element);
    }, [portEnable]);
    useEffect(() => {
        element.data.port.in[i] = portChoice;
        updateElementById(element.id, element);
    }, [portChoice]);
    return (
        <div>
            <div>Port {i}</div>
            <div className="insp_sum_port_enable_wrapper">
                <input
                    className="insp_sum_port_enable_check"
                    type="checkbox"
                    defaultChecked={portEnable}
                    onChange={() => {
                        setPortEnable((pe) => !pe);
                    }}
                />
                <div>Port Enable</div>
            </div>
            <div className="insp_sum_wrapper">
                <div
                    className="insp_sum_dropdown"
                    style={{ display: portEnable ? "" : "none" }}
                >
                    <Dropdown
                        options={options}
                        onChange={(value) => {
                            console.log(value);
                            setPortChoice(value.value);
                        }}
                        value={portChoice}
                        placeholder="Select an option"
                    />
                </div>

                <input
                    type="number"
                    className="insp_sum_dropdown insp_sum_input"
                    defaultValue={portChoice}
                    style={{ display: portEnable ? "none" : "" }}
                    onChange={(e) => setPortChoice(e.target.value)}
                />
                <button
                    className="insp_sum_button"
                    onClick={() => {
                        let newElement = {
                            ...element,
                        };
                        if (newElement.data.port.in.length > 2) {
                            newElement.data.port.in.splice(i, 1);
                            newElement.data.port.inEnable.splice(i, 1);
                        }
                        updateElementById(element.id, {
                            id: element.id,
                            type: element.type,
                            ...newElement,
                        });
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

function DiatailInspect(props) {
    // console.log("drawDetail");
    const elements = props.elements;
    const setElements = props.setElements;
    function updateElementById(id, newElementVal) {
        let items = [...elements];
        const index = elements.findIndex((x) => x.id === id);
        items[index] = newElementVal;
        setElements(items);
    }
    function pushComplist(each, compList, element, head = -1) {
        if (each.type == INS_DISPLAY_TYPE.INPUT_NUM) {
            let tmp = each.value;
            compList.push(
                <div className="insp_constant_wrapper">
                    {/* <div>{each.name}</div> */}
                    <div className="insp_constant_header">Value</div>
                    <input
                        className="insp_constant_input"
                        type={CANVAS_DISPLAY_TYPE.OUT_STR}
                        value={tmp}
                        onChange={(inputVal) => {
                            const val = parseInt(inputVal.target.value);
                            val = isNaN(val) ? 0 : val;
                            if (head == -1) {
                                element.data.info[each.index].value = val;
                            } else {
                                element.data.info[head].value[each.index] = val;
                            }
                            updateElementById(element.id, element);
                        }}
                    ></input>
                </div>
            );
        }
        if (each.type == INS_DISPLAY_TYPE.IN_VECTOR_2D) {
            let tmp = each.value;
            // console.log(element);
            compList.push(
                <div>
                    <>{each.name} </>
                    <br></br>
                    <>x </>
                    <input
                        type="number"
                        value={tmp.x}
                        onChange={(inputVal) => {
                            const val = inputVal.target.value;
                            if (head != -1) {
                                element.data.info[head].value[
                                    each.index
                                ].value.x = parseInt(val);
                            } else
                                element.data.info[index].value.x =
                                    parseInt(val);
                            updateElementById(element.id, element);
                        }}
                    ></input>
                    <br></br>
                    <>y </>
                    <input
                        type="number"
                        value={tmp.y}
                        onChange={(inputVal) => {
                            const val = inputVal.target.value;
                            if (head != -1) {
                                element.data.info[head].value[
                                    each.index
                                ].value.y = parseInt(val);
                            } else
                                element.data.info[index].value.y =
                                    parseInt(val);
                            updateElementById(element.id, element);
                        }}
                    ></input>
                </div>
            );
        }

        if (each.type == INS_DISPLAY_TYPE.INPUT_COLOR) {
            let color;
            if (head != -1) {
                color = element.data.info[head].value[each.index].value;
            } else color = element.data.info[index].value;
            if (color == null) color = "#FFFFFF";
            compList.push(
                <div>
                    <>{each.name}</>
                    <InputColor
                        initialValue={color}
                        onChange={(color) => {
                            // setColor(color);
                            if (head != -1) {
                                element.data.info[head].value[
                                    each.index
                                ].value = color.hex;
                            } else element.data.info[index].value = color.hex;
                            updateElementById(element.id, element);
                        }}
                        placement="right"
                    />
                </div>
            );
        }
    }
    if (props.id != -1) {
        try {
            const [portIn, setportIn] = useState(
                elements[elements.findIndex((x) => x.id === props.id)].data.port
                    .in
            );
            let element =
                elements[elements.findIndex((x) => x.id === props.id)];
            const config = Block.blockConfig(element.type);

            if (config.choice) {
                const options = config.choice;
                const defaultOption = options[0];
            }
            const [portChoice, setportChoice] = useState(defaultOption);
            const [portEnable, setPortEnable] = useState(1); // 1 : Enable, 0 : Disable
            const [portDisableValue, setPortDisableValue] = useState(0);
            let compList = [];
            let i = 0;
            for (i = 0; i < element.data.info.length; i++) {
                let each = element.data.info[i];
                pushComplist(each, compList, element);
                if (each.type == INS_DISPLAY_TYPE.LAYOUT_GROUP) {
                    let tmp = [];
                    each.value.forEach((subEach) => {
                        // console.log(subEach.name);
                        pushComplist(subEach, tmp, element, each.index);
                    });
                    compList.push(
                        <div style={{ border: "1px solid rgb(0, 0, 0)" }}>
                            <div style={{}}>{each.name}</div>
                            {tmp}
                        </div>
                    );
                }
            }

            let portEditShowArr = [];

            portEditShowArr.push(<div className="insp_sum_header">Ports</div>);
            for (let i = 0; i < element.data.port.in.length; i++) {
                portEditShowArr.push(
                    <PortsEdit
                        elements={elements}
                        setElements={setElements}
                        element={element}
                        i={i}
                    />
                );
            }

            return (
                <div>
                    {/* <p>id: {element.id}</p>
                    <p>type: {element.type}</p>
                    <p>port: {element.type}</p> */}
                    {compList}

                    {/* {config.limitIn[0] < element.data.port.in.length && (
                        <button>delete</button>
                    )} */}

                    {/* {a} */}
                    {(config.limitIn[1] > element.data.port.in.length ||
                        config.limitIn[1] == "inf") && (
                        <div>
                            <div className="insp_sum_header">Add Ports</div>
                            <div className="insp_sum_port_enable_wrapper">
                                <input
                                    className="insp_sum_port_enable_check"
                                    type="checkbox"
                                    defaultChecked={true}
                                    onChange={() => setPortEnable((pe) => !pe)}
                                />
                                <div>Port Enable</div>
                            </div>
                            <div className="insp_sum_wrapper">
                                <div
                                    className="insp_sum_dropdown"
                                    style={{
                                        display: portEnable ? "" : "none",
                                    }}
                                >
                                    <Dropdown
                                        // baseClassName="rdn"
                                        options={options}
                                        onChange={(value) => {
                                            console.log(value);
                                            setportChoice(value.value);
                                        }}
                                        // menu="div"
                                        value={defaultOption}
                                        placeholder="Select an option"
                                        // arrowClosed={<span className="arrow-closed" />}
                                        // arrowOpen={<span className="arrow-open" />}
                                    />
                                </div>

                                <input
                                    type="number"
                                    className="insp_sum_dropdown insp_sum_input"
                                    style={{
                                        display: portEnable ? "none" : "",
                                    }}
                                    onChange={(e) =>
                                        setPortDisableValue(e.target.value)
                                    }
                                />
                                <button
                                    className="insp_sum_button"
                                    onClick={() => {
                                        // setshowPortOption(true)element;
                                        let newElement = {
                                            ...element,
                                        };
                                        newElement.data.port.in.push(
                                            portEnable
                                                ? portChoice
                                                : portDisableValue
                                        );
                                        newElement.data.port.inEnable.push(
                                            portEnable
                                        );
                                        // console.log(portIn);
                                        console.log(
                                            newElement.data.port.inEnable
                                        );
                                        console.log(newElement.data.port.in);
                                        setportIn(newElement.data.port.in);

                                        updateElementById(element.id, {
                                            id: element.id,
                                            type: element.type,
                                            ...newElement,
                                        });
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}

                    {portEditShowArr}

                    {/* {showPortOption && <></>} */}
                </div>
            );
        } catch (err) {
            console.log(err);
            // [Ignore] Error from non Sync life cycle
        }
    }
    return (
        <div
            style={{
                display: "flex",
                flexFlow: "row",
                height: "100%",
                alignItems: "center",
            }}
        >
            <p style={{ width: "100%" }}>None of the block is selected</p>
        </div>
    );
}

function BlockShow(props) {
    // const {allBlocks} = props;
    let allBlocks = [
        {
            groupName: "Inputs",
            blocksData: [
                { name: "Constant", type: BLOCK_TYPE.IN_CONSTANT },
                { name: "Slider", type: BLOCK_TYPE.IN_SLIDER },
            ],
        },

        {
            groupName: "Operations",
            blocksData: [{ name: "Sum", type: BLOCK_TYPE.OP_SUM }],
        },

        {
            groupName: "Outputs",
            blocksData: [
                { name: "Number Display", type: BLOCK_TYPE.OUT_NUMBER_DISPLAY },
            ],
        },
    ];

    let divAllBlocks = [];

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    allBlocks.forEach((item) =>
        divAllBlocks.push(
            <div>
                <div
                    style={{
                        textAlign: "left",
                        marginBottom: "15px",
                        marginTop: "15px",
                        color: "#5c7ef5",
                        fontSize: 23,
                    }}
                >
                    {item.groupName}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexFlow: "row wrap",
                        justifyContent: "flex-start",
                    }}
                >
                    {item.blocksData.map(function (i) {
                        return (
                            <div
                                style={{
                                    border: "solid #555",
                                    borderWidth: "1px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    margin: "4px",
                                }}
                                onDragStart={(event) =>
                                    onDragStart(event, i.type)
                                }
                                draggable
                            >
                                {i.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    );
    return (
        <div
            style={{
                marginLeft: "30px",
                marginRight: "30px",
                marginTop: "20px",
            }}
        >
            {divAllBlocks}
        </div>
    );
}

export default function Inspector(props) {
    const {
        elements,
        setElements,
        selectedElementId,
        inspectorState,
        setInspectorState,
    } = props;

    return (
        <>
            <div className="inspector">
                <div className="inspector_nav">
                    <div
                        className={
                            inspectorState == 0
                                ? "inspector_selector inspector_selected"
                                : "inspector_selector"
                        }
                        onClick={() => {
                            setInspectorState(0);
                        }}
                    >
                        Object
                    </div>
                    <div
                        className={
                            inspectorState == 1
                                ? "inspector_selector inspector_selected"
                                : "inspector_selector"
                        }
                        onClick={() => {
                            setInspectorState(1);
                        }}
                    >
                        Inspector
                    </div>
                </div>

                <div
                    style={{
                        display: inspectorState ? "" : "none",
                        height: "100%",
                        overflow: "scroll",
                    }}
                >
                    <DiatailInspect
                        id={selectedElementId}
                        elements={elements}
                        setElements={setElements}
                    />
                </div>

                <div style={{ display: inspectorState ? "none" : "" }}>
                    <BlockShow />
                </div>

                {/* <ConstantInspector
                    elements={elements}
                    setElements={setElements}
                /> */}
            </div>
        </>
    );
}
