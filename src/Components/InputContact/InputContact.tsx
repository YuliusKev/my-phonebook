/** @jsxImportSource @emotion/react */
import { Button, FormGroup, InputLabel, TextField } from '@mui/material';
import * as React from 'react';
import * as styles from  "./InputContact.style.ts"

  
function InputContactForm() {
    return (
        <div>
            <h1 css={styles.title}>
                Masukkan Contact
            </h1>
            <FormGroup>
                <TextField label="Nama Depan" variant="outlined" css={styles.input}/>
                <TextField label="Nama Belakang" variant="outlined" css={styles.input}/>
                <TextField label="Nomor Telepon" variant="outlined" type='number'  css={styles.input}/>
                <Button variant="outlined" css={styles.button}>Tambah Nomor Telepon</Button>
                <Button variant="contained" css={styles.button}>Masukkan Kontak</Button>
            </FormGroup>
        </div>
    );
}

export default InputContactForm;