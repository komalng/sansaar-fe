import React, { useState, useEffect } from "react"
import {Button} from '@material-ui/core'
import { useDrop } from "react-dnd"
import update from "immutability-helper"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { compose } from "recompose"
import {get} from 'lodash'
import { ngFetch } from "../../../../providers/NGFetch"
import { ItemTypes } from "./ItemTypes"
import { RenderCard } from "./Card"
import {
  selectors as layoutSelectors,
  setMainPaneScrollToTopPending,
  setMainPaneLoading,
} from "../../../../layouts/TwoColumn/store"
import { setAllCourses, selectors as userSelectors } from "../../store"

const style = {
  width: 400,
}

const Container = ({
  pathwayId,
  actions,
  allCourses,
}) => {

  const [cards, setCards] = useState(null)
  useEffect(
    () => {
      const fetchData = async () => {
        const response = await ngFetch(`/pathways/${pathwayId}/courses`, {
          method: "GET",
        })
        actions.setAllCourses(response)

        setCards(response)
      }
      fetchData()
    },
    [actions, pathwayId],
  )

  const courses = React.useMemo(() => setCards(Object.values(allCourses)), [allCourses])
  const findCard = id => {
    const card = cards.filter(c => `${c.id}` === id)[0]
    return {
      card,
      index: cards.indexOf(card),
    }
  }



 
  console.log(cards,'cardscards')
  

  const handleSave = async (data) => {
    const courseIds = data.map(card => get(card, "course_id" , ''))
    console.log(courseIds,'courseIdscourseIds')
//     const response =await ngFetch(`/pathways/${pathwayId}/courses`, {method: 'POST', body: data});
    // actions.addOrEditCourse({pathwaysCourse: response.pathwayCourse, pathwaysCourseId:response.pathwayCourse.id});
    // enqueueSnackbar('Courses rearranged.', { variant: 'success' });
  };

  const moveCard = (id, atIndex) => {
    const { card, index } = findCard(id)
    setCards(
      update(cards, {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      })
    )
  }
  const [, drop] = useDrop({ accept: ItemTypes.CARD })
  return (
    <React.Fragment>
      <div ref={drop} style={style}>
        {cards &&
          cards.map(card => (
            <RenderCard
              key={card.id}
              id={`${card.id}`}
              text={card.name}
              logo={card.logo}
              moveCard={moveCard}
              findCard={findCard}
            />
          ))}
        <Button variant="contained" color="primary" onClick={() => handleSave(cards)}>Save</Button>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  mainPaneWidth: layoutSelectors.selectMainPaneWidth(state),
  allCourses: userSelectors.selectAllCourses(state),
  mainPaneLoading: layoutSelectors.selectMainPaneLoading(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { setAllCourses, setMainPaneScrollToTopPending, setMainPaneLoading },
    dispatch
  ),
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(Container)
