import React from 'react'
import {Card, Typography} from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import UserAvatar from "../../../Users/components/UserCard/UserAvatar";

const style = {
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  cursor: 'move',
}
export const RenderCard = ({ id, text, moveCard, findCard,logo }) => {
  const originalIndex = findCard(id).index
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem()
      const didDrop = monitor.didDrop()
      if (!didDrop) {
        moveCard(droppedId, originalIndex)
      }
    },
  })
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => false,
    hover({ id: draggedId }) {
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id)
        moveCard(draggedId, overIndex)
      }
    },
  })
  const opacity = isDragging ? 0 : 1
  return (
    <Card ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
      <Typography component="div" variant="overline">{text}</Typography>
      <UserAvatar name={text} profilePicture={logo} />
    </Card>
  )
}
