import React, { useEffect } from "react"
import { bindActionCreators } from "redux"
import { withRouter } from "react-router"
import { compose } from "recompose"
import { connect } from "react-redux"
import { useSnackbar } from "notistack"
import { withTheme, withStyles } from "@material-ui/core"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import { selectors, setPathwayToView, addOrEditPathway } from "../../store"
import {
  selectors as layoutSelectors,
  setRightPaneLoading,
} from "../../../../layouts/TwoColumn/store"
import { ngFetch } from "../../../../providers/NGFetch"
import { getPathwayEditFormStructure } from "../form"
import FormBuilder from "../../../../components/FormBuilder"
import Spacer from "../../../../components/Spacer"
import RightPaneWithTitle from "../../../../components/RightPaneWithTitle"
import Milestones from "./Milestones"
import MentorshipTree from "./MentorshipTree"
import CoursesList from "../../Courses/List"
import CourseAdd from "../../Courses/Add"
import TrackingForm from '../../TrackingForm';

const styles = () => ({
  tab: {
    minWidth: "10%",
  },
})

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <React.Fragment>{children}</React.Fragment>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  // children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const PathwayEdit = ({ rightPaneLoading, actions, match, theme, classes }) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const { pathwayId } = match.params
  const { enqueueSnackbar } = useSnackbar()
  const [trackingEnabled, setTrackingEnabled] = React.useState(null)

  const [pathway, setPathway] = React.useState(null)
  useEffect(() => {
    const fetchData = async () => {
      actions.setRightPaneLoading(true)
      const response = await ngFetch(`/pathways/${pathwayId}`)
      actions.setPathwayToView(response.pathway)
      setPathway(response.pathway)
      actions.setRightPaneLoading(false)
    }
    fetchData()
  }, [actions, pathwayId])

  const [submitBtnDisabled, setSubmitBtnDisabled] = React.useState(false)
  const onSubmit = async data => {
    // console.log(data, 'data going to submit')
    data.tracking_day_of_week= parseInt(data.tracking_day_of_week, 10)
    data.tracking_days_lock_before_cycle= parseInt(data.tracking_days_lock_before_cycle, 10)
    data.tracking_enabled = data.tracking_enabled === "false"
    // console.log(data, 'data after changing')
    setSubmitBtnDisabled(true)
    delete data.createdAt
    const response = await ngFetch(`/pathways/${pathwayId}`, {
      method: "PUT",
      body: data,
    })
    actions.addOrEditPathway({ pathway: response.pathway, pathwayId })
    setPathway(response.pathway)
    enqueueSnackbar("Pathway details saved.", { variant: "success" })
    setSubmitBtnDisabled(false)
  }

  if (!pathway || rightPaneLoading) {
    return <React.Fragment />
  }
  const selectedTrackingEnabled = v => {
    setTrackingEnabled(v)
  }

  const fieldsToWatch = {
    tracking_enabled: selectedTrackingEnabled,
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Pathways" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Courses" {...a11yProps(1)} className={classes.tab} />
          <Tab
            label="Trackingway Form"
            {...a11yProps(2)}
            className={classes.tab}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <React.Fragment>
          <RightPaneWithTitle title="Edit Pathway" closeLink="/pathways">
            <FormBuilder
              structure={getPathwayEditFormStructure(pathway, trackingEnabled)}
              onSubmit={onSubmit}
              initialValues={pathway}
              submitBtnDisabled={submitBtnDisabled}
              fieldsToWatch={fieldsToWatch}
            />
            <Spacer height={theme.spacing(1)} />
            <MentorshipTree pathway={pathway} />
            <Spacer height={theme.spacing(1)} />
            <Milestones pathway={pathway} />
          </RightPaneWithTitle>
        </React.Fragment>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RightPaneWithTitle title="Courses" closeLink="/pathways">
          <CourseAdd pathwayId={pathway.id} />
          <Spacer height={theme.spacing(1)} />
          <CoursesList pathwayId={pathway.id} />
        </RightPaneWithTitle>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TrackingForm pathway={pathway} />
      </TabPanel>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  rightPaneLoading: layoutSelectors.selectRightPaneLoading(state),
  pathway: selectors.selectPathwayToView(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { setRightPaneLoading, setPathwayToView, addOrEditPathway },
    dispatch
  ),
})

export default compose(
  withTheme,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(PathwayEdit)