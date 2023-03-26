import {createContext,useReducer,useEffect} from 'react'

export const AuthContext=createContext()


export const AuthContextProvider=({children})=>{

    const authReducer=(state,action)=>{

        if(action.type=='LOGIN'){
           

            return {
                user:action.payload
            }
        }
        else if(action.type=='LOGOUT'){
            return {
                user:null
            }
        }
        else if(action.type=='IMAGE'){
           const u={...state.user,image:action.payload}
           localStorage.setItem('user',JSON.stringify(u))
           console.log(u)
            return{
                user:u
            }
        }

        return state
    }

    const [state,dispatch]=useReducer(authReducer,{
        user:null
    })

    useEffect(() => {
        let user=localStorage.getItem('user')
        if(user){
            dispatch({type:'LOGIN',payload:JSON.parse(user)})
            console.log(user)
        }
    }, []);

    return (
        <AuthContext.Provider value={{...state,dispatch}}>   
            {children}
        </AuthContext.Provider>
    )
}