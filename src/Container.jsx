//react dnd
import React from "react";
import { useCallback, useState, useContext } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import Box from "./Box";
import update from "immutability-helper";
import { DndContainer } from "./Layout/DndContainer.styled";
import { MeTreeContext } from "./MeTree";

export default function Container({ hideSourceOnDrag }) {
  const { state, dispatch } = useContext(MeTreeContext);

  // when you move box the coords update
  const moveBox = useCallback(
    (id, left, top) => {
      dispatch({
        type: "update_boxes",
        newBoxes: update(state.data.tree.boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      });
    },
    [state.data.tree.boxes, dispatch]
  );

  console.log("CONTAINER: state.data.tree.boxes ", state.data.tree.boxes);

  // TODO: what is happening here ?
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <DndContainer ref={drop}>
      {/* {Object.keys(state.data.tree.boxes).map((key) => {
        console.log("CONTAINER: in object.key", state.data.tree.boxes); //WHY SIX TIMES? - NOW TWICE
        const { left, top, isGrowing } = state.data.tree.boxes[key];
        return (
          <Box
            key={key}
            id={key}
            left={left}
            top={top}
            isGrowing={isGrowing}
            growing={state.data.tree.growing}
            whoAround={state.data.tree.whoAround}
            hideSourceOnDrag={hideSourceOnDrag}
          ></Box>
        );
      })} */}
    </DndContainer>
  );
}
