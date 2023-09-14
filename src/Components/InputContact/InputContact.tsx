/** @jsxImportSource @emotion/react */
import { Button, FormGroup, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import ContactHeader from "../ContactHeader"
import * as styles from  "./InputContact.style.ts"
import { useMutation } from '@apollo/client';
import  { ADD_CONTACT_MUTATIONS } from '../../GraphQL/Mutations.tsx'
import { Container } from '@mui/material';
  
function InputContactForm() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>('');
    const [listPhone, setListPhone] = useState(
        [{ number : '' }],
    );



    const [phoneCounter, setPhoneCounter] = useState<number>(1);
    
    const [AddContactWithPhones, { error }] = useMutation(ADD_CONTACT_MUTATIONS)
    const addContact = () => {
        AddContactWithPhones({
            variables: {
                "first_name": firstName,
                "last_name" : lastName,
                "phones": listPhone
            }
        })

        if(error) {
            console.log(error);
        }
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
        <>
            <FormGroup>
                <TextField label="Nama Depan" variant="outlined" value={firstName} onChange={e => setFirstName(e.target.value)} css={styles.input}/>
                <TextField label="Nama Belakang" variant="outlined" value={lastName} onChange={e => setLastName(e.target.value)} css={styles.input}/>
                {listPhone.map((value, index) => {
                    return <TextField
                                key={index}
                                inputProps={{ type: "number"} } 
                                label="Nomor Telepon" 
                                variant="outlined" 
                                value={value.number}
                                onChange={e => valuePhoneNumber(index, e.target.value)} 
                                css={styles.input}
                            />
                })}
                <Button variant="outlined" css={styles.button} onClick={() => addPhone()}>Tambah Nomor Telepon</Button>
                <Button variant="contained" onClick={() => addContact()} css={styles.button}>Masukkan Kontak</Button>
            </FormGroup>
        </>
    );
}

export default InputContactForm;