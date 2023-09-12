import React, {useEffect, useState} from 'react';
import {useQuery, gql}from '@apollo/client'
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries"
import ContactHeader from "./ContactHeader"

function ShowLists() {
    const {error, loading, data} = useQuery(LOAD_CONTACT_LISTS);
    const [list, setList] = useState(Array());
    

    useEffect(() => {
        if(data){
            setList(data.contact)
        }
    }, [data])
    
    return <div>
        <ContactHeader />
        {list.map((thedata) => {
        return <>
            <h1 key={thedata.id}>{`${thedata.first_name} ${thedata.last_name} - ${thedata.phones[0].number}`}</h1>
        </>
    })} </div>
  }
  
  export default ShowLists;