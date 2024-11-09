# base32

Implementation of RFC 3548 Base32 encoding/decoding for zepp quickjs.

## Usage
    import {encode, decode} from 'base32/index.js'
    base32.encode('node');
    // output: NZXWIZI=
    base32.decode('NZXWIZI=');
    //output: node
