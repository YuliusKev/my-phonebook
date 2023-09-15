/** @jsxImportSource @emotion/react */
import { Button, FormGroup, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries.tsx"
import  { ADD_CONTACT_MUTATIONS } from '../GraphQL/Mutations.tsx'
import { Grid } from '@mui/material';
  
function InputContactForm() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>('');
    const [listPhone, setListPhone] = useState(
        [{ number : '' }],
    );
    const [nameError, setNameError] = useState<boolean>(false)


    const {error : errorFetching, loading, data, refetch, fetchMore} = useQuery(LOAD_CONTACT_LISTS);

    const [phoneCounter, setPhoneCounter] = useState<number>(1);
    
    const [AddContactWithPhones, { error: errorSubmit }] = useMutation(ADD_CONTACT_MUTATIONS)
    const addContact = () => {
        if(firstName === lastName){
           setNameError(true);
        }
        // AddContactWithPhones({
        //     variables: {
        //         "first_name": firstName,
        //         "last_name" : lastName,
        //         "phones": listPhone
        //     }
        // })

        // if(error) {
        //     console.log(error);
        // }
    }

    const addPhone = () => {
        setListPhone((value) => {
            return [...value, {number : ''}];
        })
    } 


    const valuePhoneNumber = (index : number, phoneNumber : string) => {
        setListPhone((prevPhone) => {
          const copyPhone = [...prevPhone];
          copyPhone[index].number = phoneNumber
          return copyPhone
        })
    }

    return (
        <Grid>
            <FormGroup sx={{ paddingTop: 2}}>
                <TextField 
                    error={(nameError) ? true : false}
                    label="Nama Depan" 
                    variant="outlined" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    sx={{ margin: "5px"}}
                />
                <TextField label="Nama Belakang" variant="outlined" value={lastName} onChange={e => setLastName(e.target.value)}  sx={{ margin: "5px"}}/>
                {listPhone.map((value, index) => {
                    return <TextField
                                key={index}
                                inputProps={{ type: "number"} } 
                                label="Nomor Telepon"
                                variant="outlined" 
                                value={value.number}
                                onChange={e => valuePhoneNumber(index, e.target.value)}
                                sx={{ margin: "5px"}}
                            />
                })}
                <Button variant="outlined" sx={{ margin: "5px"}} onClick={() => addPhone()}>Tambah Nomor Telepon</Button>
                <Button variant="contained" sx={{ margin: "5px"}} onClick={() => addContact()}>Masukkan Kontak</Button>
            </FormGroup>
        </Grid>
    );
}

export default InputContactForm;