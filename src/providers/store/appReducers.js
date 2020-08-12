import { combineReducers } from 'redux';

import { AuthSlice } from '../../auth';
import { LayoutSlice } from '../../layouts/TwoColumn/store'
import { UserSectionSlice } from '../../views/Users/store';

export default combineReducers({
  [AuthSlice.name]: AuthSlice.reducer,
  [LayoutSlice.name]: LayoutSlice.reducer,
  [UserSectionSlice.name]: UserSectionSlice.reducer
});
