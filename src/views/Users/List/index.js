import React, { useEffect, Fragment } from 'react';
import { Typography, withTheme } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { compose } from 'recompose';
import tableColumns from './table';
import UserCard from '../components/UserCard';
import TableOrCardList from '../../../components/TableOrCardList';
import { ngFetch } from '../../../providers/NGFetch';
import { selectors as layoutSelectors, setMainPaneScrollToTopPending, setMainPaneLoading } from '../../../layouts/TwoColumn/store';
import { setAllUsers, selectors as userSelectors } from '../store';
import history from '../../../providers/routing/app-history';
import Spacer from '../../../components/Spacer';


function UserList({ mainPaneWidth, actions, allUsers, theme, mainPaneLoading }) {

  useEffect(() => {
    const fetchData = async () => {
      actions.setMainPaneLoading(true);
      const response = await ngFetch('/users', { method: 'GET' });
      actions.setAllUsers(response.users);
      actions.setMainPaneLoading(false);
    };
    fetchData();
  }, [actions]);

  const userCard = (user, key) => (
    <UserCard
      key={key}
      id={user.id}
      name={user.name}
      profilePicture={user.profile_picture}
      rolesList={user.rolesList}
      eMail={user.email}
      joinedAt={user.createdAt}
    />
  )

  const users = React.useMemo(() => Object.values(allUsers), [allUsers]);

  const handleRowClick = (userId) => {
    history.push(`/users/${userId}`)
  }
  console.log(allUsers, "Allusers")
  return (
    <Fragment>

      <Typography variant="h3">Users</Typography>
      <Spacer height={theme.spacing(2)} />

      <TableOrCardList
        loading={mainPaneLoading}
        tableColumns={tableColumns}
        data={users}
        containerWidth={mainPaneWidth}
        renderCard={userCard}
        onRowClick={handleRowClick}
        scrollContainerToTop={() => actions.setMainPaneScrollToTopPending(true)}
      />

    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  mainPaneWidth: layoutSelectors.selectMainPaneWidth(state),
  allUsers: userSelectors.selectAllUsers(state),
  mainPaneLoading: layoutSelectors.selectMainPaneLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ setAllUsers, setMainPaneScrollToTopPending, setMainPaneLoading }, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTheme
)(UserList);