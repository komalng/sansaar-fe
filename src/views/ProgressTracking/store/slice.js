import { createSlice } from '@reduxjs/toolkit';
import fromPairs from 'lodash/fromPairs';

const ProgressSectionSlice = createSlice({
  name: 'progressSection',
  initialState: {
    parameterToView: null,
    allParameters: {},
  },
  reducers: {
    setAllParameters: (state, action) => {
      state.allParameters = fromPairs( action.payload.map(u => [u.id, u]) );
    },
    setParameterToView: (state, action) => {
      state.parameterToView = action.payload
    },
    addOrEditParameter: (state, {payload : {parameter, parameterId}}) => {
      state.allParameters[parameterId] = {...parameter,id:parameterId}
  },
  },
});

export default ProgressSectionSlice;