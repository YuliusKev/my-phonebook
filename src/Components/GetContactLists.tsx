import React, {useEffect, useState} from 'react';
import {useQuery, gql}from '@apollo/client'
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries"

function ShowLists() {
    const {error, loading, data} = useQuery(LOAD_CONTACT_LISTS);
    const [list, setList] = useState(Array());

    useEffect(() => {
        if(data){
            setList(data.contact)
        }
    }, [data])
    
    return <div>{list.map((thedata) => {
        return <h1 key={thedata.id}>{`${thedata.first_name} ${thedata.last_name}`}</h1>
    })} </div>
  }
  
  export default ShowLists;