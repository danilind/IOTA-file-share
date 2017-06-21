# iota-file-share


## Message protocol(message is 2,187 trytes)
- 1st tryte: meta encoding type
- Remaining 2,186 trytes: remaining message formated with the meta encoding type

## Encoding types (can fill 2,186 trytes)

### FIRST[A]
1th-30th trytes: file name in ascii encoding
next 81 trytes (31-112): next tx hash (no encoding)
remaining 2074 trytes: file data

### Next tx hash (all middle transactions)[B] 
This is used by all txs except the last one, it contains a reference to the transaction of the next file chunk

1th-81th trytes: next tx gasg
remaining 2105 trytes: file data

### Final transaction [C]
1th-2186th: file data
