/**
 * Created by Daniel on 08.06.2017.
 */

function sendTransferWrapper(seed, transfer, options, callback, status_callback){
    try{
        status_callback(0, "Preparing transfers");
    }catch(err){}

    window.iota.api.prepareTransfers(seed, transfer, options, function(error, trytes) {

        if (error) {
            return callback(error)
        }

        sendTrytesWrapper(trytes, window.depth, window.minWeightMagnitude, callback, status_callback);
    })
}

function sendTrytesWrapper(trytes, depth, minWeightMagnitude, callback, status_callback){
    try{
        status_callback(0, "Finding transactions to approve");
    }catch(err){}

    window.iota.api.getTransactionsToApprove(window.depth, function(error, toApprove) {
        if (error) {
            return callback(error)
        }

        attachToTangle(toApprove.trunkTransaction, toApprove.branchTransaction, minWeightMagnitude, trytes, status_callback, function(error, attached) {
            if (error) {
                return callback(error)
            }

            iota.api.storeAndBroadcast(attached, function(error, success) {
                if (error) {
                    return callback(error);
                }

                var finalTxs = [];

                attached.forEach(function(trytes) {
                    finalTxs.push(window.iota.utils.transactionObject(trytes));
                });

                return callback(null, finalTxs);
            })
        })
    })
}

function attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes_in, status_callback, callback){
    try {
        branchTransaction = trits(branchTransaction);
        trunkTransaction = trits(trunkTransaction);
    }catch (err){
        callback(err, null);
    }

    var prevTransaction = null;
    var rec_pow = function (res, i) {
        try{
            status_callback(i / trytes_in.length, "Doing proof of work: " + i + " of " + trytes_in.length + " are complete");
        }catch(err){}

        try {
            if (i >= trytes_in.length) {
                return callback(null, res.reverse());
            }

            var transactionTrits = trits(trytes_in[i]);
            arrayCopy(prevTransaction === null ? trunkTransaction : prevTransaction, 0, transactionTrits, window.TRUNK_TRANSACTION_TRINARY_OFFSET, window.TRUNK_TRANSACTION_TRINARY_SIZE);
            arrayCopy(prevTransaction === null ? branchTransaction : trunkTransaction, 0, transactionTrits, window.BRANCH_TRANSACTION_TRINARY_OFFSET, window.BRANCH_TRANSACTION_TRINARY_SIZE);

            var transactionTrytes = trytes(transactionTrits);

            curl.pow(transactionTrytes, minWeightMagnitude
            ).then(function (hash) {
                prevTransaction = trits(window.iota.utils.transactionObject(hash).hash);
                res.push(hash);
                return rec_pow(res, i + 1);
            }).catch(function (err) {
                callback(err, null);
            });
        }catch(err){
            callback(err, null);
        }
    };

    rec_pow([], 0);
}
