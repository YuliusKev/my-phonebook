/** @jsxImportSource @emotion/react */
import { Button, FormGroup, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import * as styles from  "./InputContact.style.ts"
import { useMutation } from '@apollo/client';
import  { ADD_CONTACT_MUTATIONS } from '../../GraphQL/Mutations.tsx'

  
function InputContactForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState(Number);

    const [AddContactWithPhones, { error }] = useMutation(ADD_CONTACT_MUTATIONS)

    const addContact = () => {
        AddContactWithPhones({
            variables: {
                "first_name": firstName,
                "last_name" : lastName,
                "phones": [
                    {
                        "number":phone
                    },
                ]
            }
        })

        if(error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h1 css={styles.title}>
                Masukkan Contact
            </h1>
            <FormGroup>
                <TextField label="Nama Depan" variant="outlined" onChange={e => setFirstName(e.target.value)} css={styles.input}/>
                <TextField label="Nama Belakang" variant="outlined" onChange={e => setLastName(e.target.value)} css={styles.input}/>
                <TextField label="Nomor Telepon" variant="outlined" type='number' onChange={e => setPhone(Number(e.target.value))} css={styles.input}/>
                <Button variant="outlined" css={styles.button}>Tambah Nomor Telepon</Button>
                <Button variant="contained" onClick={() => addContact()} css={styles.button}>Masukkan Kontak</Button>
            </FormGroup>
        </div>
    );
}

export default InputContactForm;