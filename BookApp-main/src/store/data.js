import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const dataSlice=createSlice({
    name:'data',
    initialState:{
        books:[],
        status:true
    },
    reducers:{
        fetchData(state,action){
            state.books=[...action.payload]
            for(let i=0;i<state.books.length;i++){
                state.books[i]={...state.books[i],id:i+1}
            }
            state.status='updated'
        },
        actionData(state){
            state.status='not updated'
        },
        clearData(state){
            state.books=[]
        }
    }
})

const store=configureStore({
    reducer:dataSlice.reducer
})

// export default dataSlice
export const dataAction=dataSlice.actions
export default store