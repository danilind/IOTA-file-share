/**
 * Created by Daniel on 18.06.2017.
 */

function uploadToTangle(slices, callback, status_callback){
    var to_address = '';
    for (var i = 0; i < slices.length; i++){
        var transfer = [{
            'address': to_address,
            'value': 0,
            'message': window.iota.utils.toTrytes(slices[i])
        }];
        sendTransferWrapper(getSeed(), transfer, {}, callback, status_callback);
    }
}

function getSeed(){
    return sessionStorage.getItem('seed');
}
