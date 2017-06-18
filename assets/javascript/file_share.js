/**
 * Created by Daniel on 18.06.2017.
 */

function openFile(event){
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var arrayBuffer = reader.result;

        // Chop it into chunks of size 2048 bytes and put in into the tangle
        var slices = chop(arrayBuffer, 2048);
        uploadToTangle(slices, function(e, id){
            document.getElementById('file_upload_msg').innerHTML = 'Upload successfull. Id is: ' + id;
        });
    };
    reader.readAsArrayBuffer(input.files[0]);
}

function download(input){
    var id = input.val();

}