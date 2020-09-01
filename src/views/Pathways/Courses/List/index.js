import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {  withTheme } from "@material-ui/core"
import { compose } from "recompose"
import { withRouter } from 'react-router';
import Container from './Container'
import MainPaneWithTitle from '../../../../components/MainPaneWithTitle';

const CoursesList =({
    match,
  }) => {

    const { pathwayId } = match.params

  return (
    <MainPaneWithTitle addBtnLink={`/pathways/${pathwayId}/courses/add`} title='Courses'>
      <DndProvider backend={HTML5Backend}>
        <Container pathwayId={pathwayId} />
      </DndProvider>
    </MainPaneWithTitle>
  )
}


export default compose(
  withTheme,
  withRouter,
)(CoursesList)