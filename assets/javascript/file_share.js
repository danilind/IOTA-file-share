/**
 * Created by Daniel on 18.06.2017.
 */

function openFile(event){
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){

        // Chop it into chunks of size 2048 bytes and put in into the tangle
        try {
            // NOTE: Not supported in IE and safari
            var arrayBuffer = new Uint8Array(reader.result);
            var slices = chunk(arrayBuffer, 2048);
            var trits = bytesToTrits(slices[0]);
            var clean = bytes(trits);
            alert('Org: ' + slices[0]);
            alert('Result: ' + clean);
        }catch (err){
            alert('Error: ' + err);// TODO: Not working for kontrinsplan
        }
        /*
        uploadToTangle(slices, function(e, id){
            document.getElementById('file_upload_msg').innerHTML = 'Upload successful. Id is: ' + id;
        });*/
    };
    reader.readAsArrayBuffer(input.files[0]);
}

function download(input){
    var id = input.val();

}