/**
 * Created by Daniel on 18.06.2017.
 */

function chunk(a, len) {
    var res = [];
    for (var i = 0; i < a.length; i+=len){
        if (i+len >= a.length){
            res.push(a.slice(i, a.length));
        }else {
            res.push(a.slice(i, i + len));
        }
    }

    return res;
}

function arrayCopy(src, src_start, dst, dst_start, len){
    for (var i = src_start; i < src_start + len; i++){
        dst[dst_start + (i - src_start)] = src[i];
    }
}

function bytesToTrits(bytes) {
    var trits = initArray(Math.ceil(bytes.length / window.NUMBER_OF_TRITS_IN_A_BYTE), 0);
    var offset = 0;
    for (var i = 0; i < bytes.length && offset < trits.length; i++) {
        arrayCopy(BYTE_TO_TRITS_MAPPINGS[bytes[i] < 0 ? (bytes[i] + BYTE_TO_TRITS_MAPPINGS.length) :
            bytes[i]], 0, trits, offset, trits.length - offset < NUMBER_OF_TRITS_IN_A_BYTE ? (trits.length - offset) :
                NUMBER_OF_TRITS_IN_A_BYTE);
        offset += NUMBER_OF_TRITS_IN_A_BYTE;
    }
    while (offset < trits.length) {
        trits[offset++] = 0;
    }

    return trits;
}

function bytes(trits) {
    var offset = 0;
    var size = trits.length;
    bytes = new Array((size + NUMBER_OF_TRITS_IN_A_BYTE - 1) / NUMBER_OF_TRITS_IN_A_BYTE);
    for (var i = 0; i < bytes.length; i++) {

        var value = 0;
        for (var j = (size - i * NUMBER_OF_TRITS_IN_A_BYTE) < 5 ? (size - i * NUMBER_OF_TRITS_IN_A_BYTE) : NUMBER_OF_TRITS_IN_A_BYTE; j-- > 0; ) {
            value = value * RADIX + trits[offset + i * NUMBER_OF_TRITS_IN_A_BYTE + j];
        }
        bytes[i] = value;
    }

    return bytes;
}

function loadGlobal(){
    window.iota = new window.IOTA({
        'provider': 'http://iota.bitfinex.com:80'
    });

    window.depth = 4;
    window.minWeightMagnitude = 15;

    window.units = ['i', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];
    window.RADIX = 3;
    window.MAX_TRIT_VALUE = 1;
    window.MIN_TRIT_VALUE = -1;

    // All possible tryte values
    window.trytesAlphabet = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // map of all trits representations
    window.trytesTrits = [
        [ 0,  0,  0],
        [ 1,  0,  0],
        [-1,  1,  0],
        [ 0,  1,  0],
        [ 1,  1,  0],
        [-1, -1,  1],
        [ 0, -1,  1],
        [ 1, -1,  1],
        [-1,  0,  1],
        [ 0,  0,  1],
        [ 1,  0,  1],
        [-1,  1,  1],
        [ 0,  1,  1],
        [ 1,  1,  1],
        [-1, -1, -1],
        [ 0, -1, -1],
        [ 1, -1, -1],
        [-1,  0, -1],
        [ 0,  0, -1],
        [ 1,  0, -1],
        [-1,  1, -1],
        [ 0,  1, -1],
        [ 1,  1, -1],
        [-1, -1,  0],
        [ 0, -1,  0],
        [ 1, -1,  0],
        [-1,  0,  0]
    ];

    window.TRUNK_TRANSACTION_TRINARY_OFFSET = 7290;
    window.TRUNK_TRANSACTION_TRINARY_SIZE = 243;
    window.BRANCH_TRANSACTION_TRINARY_OFFSET = 7533;
    window.BRANCH_TRANSACTION_TRINARY_SIZE = 243;
    window.NUMBER_OF_TRITS_IN_A_TRYTE = 3;
    window.MAX_MESSAGE_SIZE = 2048;
    window.NUMBER_OF_TRITS_IN_A_BYTE = 5;
    loadMappings();
}

function loadMappings() {
    window.BYTE_TO_TRITS_MAPPINGS = new Array(243);
    window.TRYTE_TO_TRITS_MAPPINGS = new Array(27);

    var trits = initArray(NUMBER_OF_TRITS_IN_A_BYTE, 0);

    for (i = 0; i < 243; i++)
    {
        BYTE_TO_TRITS_MAPPINGS[i] = copyArray(trits);
        trits = increment(trits, NUMBER_OF_TRITS_IN_A_BYTE);
    }

    for (i = 0; i < 27; i++)
    {
        TRYTE_TO_TRITS_MAPPINGS[i] = copyArray(trits);
        trits = increment(trits, NUMBER_OF_TRITS_IN_A_TRYTE);
    }
}

function increment(trits, size) {
    for (var i = 0; i < size; i++) {
        if (++trits[i] > MAX_TRIT_VALUE) {
            trits[i] = MIN_TRIT_VALUE;
        } else {
            break;
        }
    }
    return trits;
}

function copyArray(array){
    var newArray = [];
    for (var i = 0; i < array.length; i++){
        newArray.push(array[i]);
    }
    return newArray;
}

function initArray(length, default_value){
    var a = [];
    for (var i = 0; i < length; i++){
        a.push(default_value);
    }

    return a;
}